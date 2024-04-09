import React, { useEffect, useRef, useState } from 'react';
import { recognizeSign, submitFeedback } from '../network/adapter';
import { twMerge } from 'tailwind-merge'
import { ScaleLoader } from 'react-spinners';

export interface SignRecognitionProps {
  modelName?: string

  containerClassName?: string;
  cameraClassName?: string;
  buttonClassName?: string;
  loaderClassName?: string;
  interpretationClassName?: string;
  includeFeedback?: boolean;
  feedbackClassName?: string;

  gotResult: (_: String) => void
}

enum State {
  WAITING,
  RECORDING,
  PROCESSING,
  RATING,
  CORRECTING
}

export const SignRecognition = ({
  modelName = "LATEST",

  containerClassName = "",
  cameraClassName = "",
  interpretationClassName = "",
  includeFeedback = true,
  feedbackClassName = "",
  loaderClassName = "",
  buttonClassName = "",
  gotResult = (_) => { },
  ...props
}: SignRecognitionProps) => {
  const preview = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);

  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [state, setState] = useState(State.WAITING);
  const [correction, setCorrection] = useState<string | null>(null);
  const [feedbackID, setFeedbackID] = useState<string | null>(null);

  const startRecording = () => {
    if (stream.current == null) {
      return;
    }

    recorder.current = new MediaRecorder(stream.current);
    setState(State.RECORDING);
    recorder.current.start();

    recorder.current.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: "video/mp4" });
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setState(State.PROCESSING)
        recognizeSign((reader.result as string).split(",")[1], modelName).then(([v, fb]) => {
          setFeedbackID(fb);
          setInterpretation(v);
          if (includeFeedback) {
            setState(State.RATING);
          } else {
            gotResult(v);
            setState(State.WAITING);
          }
        });
      }
    };
    recorder.current.onstop = (_) => {
      setState(State.WAITING);
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
  const submitCorrection = () => {
    if (feedbackID == null) {
      setState(State.WAITING);
      return;
    }
    setInterpretation(correction ?? interpretation!);
    gotResult(correction ?? interpretation!);
    submitFeedback(feedbackID, null, correction ?? interpretation!);
    setFeedbackID(null);
    setCorrection(null);
    setState(State.WAITING);
  }
  const submitGood = (good: boolean) => {
    if (feedbackID == null) {
      gotResult(interpretation!);
      setState(State.WAITING);
      return
    }
    submitFeedback(feedbackID, good, null);
    if (good) {
      gotResult(interpretation!);
      setState(State.WAITING);
    } else {
      setState(State.CORRECTING);
    }
  }
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
        className={twMerge(`max-w-[25vw] mx-auto ${cameraClassName}`)}
      />
      {
        interpretation != null && interpretation.trim().length > 0 ? <p className={twMerge(`mt-2 p-3 mx-auto ${interpretationClassName}`)}>{interpretation}</p> : null
      }
      {state == State.PROCESSING ?
        <ScaleLoader speedMultiplier={0.4} color={'#00AA9D'} className={twMerge(`mt-2 p-3 mx-auto ${loaderClassName}`)} />
      : state == State.RECORDING ? 
        <button
          className={`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${buttonClassName}`}
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      : state == State.WAITING ? 
        <button
          className={`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${buttonClassName}`}
          onClick={startRecording}
        >
          Start Recording
        </button>
      : state == State.CORRECTING ?
        <input
          className={twMerge(`mt-2 p-3 rounded-sm border-sign-speak-teal border ${feedbackClassName}`)}
          onSubmit = {submitCorrection}
          onKeyUp = {e => e.key == "Enter" ? submitCorrection() : null}
          onChange = {e => setCorrection(e.target.value)}
          defaultValue = {interpretation ?? ""}
        />
      :
        <div className="flex flex-row justify-center">
          <button onClick={() => submitGood(true)} className={twMerge(`mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ${buttonClassName}`)}>Send</button>
          <button onClick={() => submitGood(false)} className={twMerge(`mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ${buttonClassName}`)}>Edit</button>
        </div>
      }
    </div>
  );
};