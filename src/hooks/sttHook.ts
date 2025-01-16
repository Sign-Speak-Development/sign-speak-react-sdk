import { useState, useEffect, useRef } from "react";
import { RecognitionPrediction, RecognitionResult, recognizeSpeech } from "../network/rest";

interface UseSpeechRecognitionConfig {
  deviceId?: string;
  model?: string | null;
  language?: string | null;
}

export function useSpeechRecognition(config?: UseSpeechRecognitionConfig) {
  const [prediction, setPrediction] = useState<RecognitionResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [recording, setRecording] = useState(false);

  const configRef = useRef(config ?? {})
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    configRef.current = config ?? {}
  }, [config])
  // Initializes the audio stream using getUserMedia. Optionally uses a specific device.
  async function initStream() {
    if (streamRef.current) return streamRef.current;
    try {
      const constraints: MediaStreamConstraints = {
        audio: configRef.current?.deviceId
          ? { deviceId: { exact: configRef.current.deviceId } }
          : true,
        video: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      return stream;
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  // Start capturing audio and set up the recorder.
  const startRecognition = async () => {
    try {
      const stream = await initStream();
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      setRecording(true);
      recorder.start();

      recorder.ondataavailable = (e: BlobEvent) => {
        const blob = new Blob([e.data], { type: "audio/mp3" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          try {
            setLoading(true);
            // Extract the base64-encoded audio data.
            const base64Audio = (reader.result as string).split(",")[1];
            // Call the recognizeSpeech API.
            const result = await recognizeSpeech(base64Audio, {
              model: configRef.current?.model ?? undefined,
              language: configRef.current?.language ?? undefined
            });
            setPrediction(result);
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        };
      };

      recorder.onstop = () => {
        setRecording(false);
      };
    } catch (err) {
      // Error already handled in initStream.
    }
  };

  // Stops the recording and cleans up the audio stream.
  const stopRecognition = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount.
      stopRecognition();
    };
  }, []);

  return { startRecognition, stopRecognition, prediction, loading, error, recording };
}