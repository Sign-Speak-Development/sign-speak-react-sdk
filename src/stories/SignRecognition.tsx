import React, { useEffect, useRef, useState } from 'react';
import { recognizeSign } from '../network/adapter';
import ClipLoader from "react-spinners/ClipLoader";
import { setKey } from '../network/key';
import { twMerge } from 'tailwind-merge'

export interface SignRecognitionProps {
  modelName?: string

  containerClassName?: string;
  cameraClassName?: string;
  buttonClassName?: string;
  interpretationClassName?: string;

  gotResult: (_: String) => void
}

export const SignRecognition = ({
  modelName = "LATEST",

  containerClassName = "",
  cameraClassName = "",
  buttonClassName = "",
  interpretationClassName = "",

  gotResult = (_) => { },
  ...props
}: SignRecognitionProps) => {
  const preview = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);

  const [interpretation, setInterpretation] = useState<string | null>(null);
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
      const blob = new Blob([e.data], { type: "video/mp4" });
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setProcessing(true)
        recognizeSign((reader.result as string).split(",")[1]).then((v) => {
          setProcessing(false)
          setInterpretation(v);
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
        video: true,
        audio: false,
      })
      .then((new_stream: MediaStream) => {
        stream.current = new_stream;
        if (preview.current != null) {
          preview.current!.srcObject = new_stream;
        }
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
      <video
        autoPlay
        playsInline
        muted
        ref={preview}
        className={cameraClassName}
      />
      {
        interpretation != null && interpretation.trim().length > 0 ? <p className={twMerge(`mt-2 p-3 mx-auto ${interpretationClassName}`)}>{interpretation}</p> : null
      }
      {processing ?
        <ClipLoader className={twMerge(`mt-2 p-3 mx-auto ${containerClassName}`)} /> :
        recording ? (
          <button
            className={`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        ) : (
          <button
            className={`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}
            onClick={startRecording}
          >
            Start Recording
          </button>
        )
      }
    </div>
  );
};