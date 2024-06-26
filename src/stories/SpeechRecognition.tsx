import React, { useEffect, useRef, useState } from 'react';
import { recognizeSign, recognizeSpeech } from '../network/adapter';
import { setKey } from '../network/key';
import { twMerge } from 'tailwind-merge'
import { ScaleLoader } from 'react-spinners';

export interface SpeechRecognitionProps {
  modelName?: string

  containerClassName?: string;
  buttonClassName?: string;
  transcriptionClassName?: string;
  loadingClassName?: string;

  gotResult: (_: String) => void
}

export const SpeechRecognition = ({
  modelName = "LATEST",

  containerClassName = "",
  buttonClassName = "",
  transcriptionClassName = "",
  loadingClassName = "",

  gotResult = (_) => { },
  ...props
}: SpeechRecognitionProps) => {
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);

  const [transcription, setTranscription] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    if (stream.current == null) {
      return;
    }

    recorder.current = new MediaRecorder(stream.current);
    setRecording(true);
    recorder.current.start();

    recorder.current.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: "audio/mp3" });
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setProcessing(true)
        recognizeSpeech((reader.result as string).split(",")[1]).then((v) => {
          setProcessing(false)
          setTranscription(v);
          gotResult(v);
        });
      }
    };
    recorder.current.onstop = (_) => {
      setRecording(false);
    };
  };
  const stopRecording = () => {
    if (recorder.current == null) {
      return null;
    }
    if (recorder.current.state === "recording") {
      recorder.current.stop();
    }
  };
  const initRecording = () => {
    if (stream.current) {
      const tracks = stream.current.getTracks();
      tracks.forEach((track) => track.stop());
    }
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((new_stream: MediaStream) => {
        stream.current = new_stream;
      });
  };
  useEffect(() => {
    initRecording();
    return () => {
      if (stream.current) {
        const tracks = stream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);
  return (
    <div className={twMerge(`flex flex-col ${containerClassName}`)}>
      {
        transcription != null && transcription.trim().length > 0 ? <p className={twMerge(`mt-2 p-3 mx-auto ${transcriptionClassName}`)}>{transcription}</p> : null
      }
      {processing ?
        <ScaleLoader color={'#00AA9D'} className={twMerge(`mt-2 p-3 mx-auto ${loadingClassName}`)} /> :
        recording ? (
          <button
            className={twMerge(`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${buttonClassName}`)}
            onClick={stopRecording}
          >
            Stop Listening
          </button>
        ) : (
          <button
            className={twMerge(`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${buttonClassName}`)}
            onClick={startRecording}
          >
            Start Listening
          </button>
        )
      }
    </div>
  );
};