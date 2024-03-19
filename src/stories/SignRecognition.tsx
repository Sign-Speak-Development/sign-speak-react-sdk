import React, { useEffect, useRef, useState } from 'react';
import { recognizeSign, submitFeedback } from '../network/adapter';
import ClipLoader from "react-spinners/ClipLoader";
import { setKey } from '../network/key';
import { twMerge } from 'tailwind-merge'
import { SpeechProduction } from './SpeechProduction';

export interface SignRecognitionProps {
  modelName?: string

  containerClassName?: string;
  cameraClassName?: string;
  buttonClassName?: string;
  interpretationClassName?: string;
  includeFeedback?: boolean;

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
  buttonClassName = "",
  interpretationClassName = "",
  includeFeedback = true,

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
          setState(State.RATING);
          setInterpretation(v);
          gotResult(v);
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
    setInterpretation(correction);
    submitFeedback(feedbackID, null, correction);
    setFeedbackID(null);
    setCorrection(null);
    setState(State.WAITING);
  }
  const submitGood = (good: boolean | null) => {
    if (good == null || feedbackID == null) {
      setState(State.WAITING);
      return
    }
    submitFeedback(feedbackID, good, null);
    if (good) {
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
      {interpretation ? <SpeechProduction text={interpretation} /> : null}
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
        <ClipLoader color={'#00AA9D'} className={twMerge(`mt-2 p-3 mx-auto ${containerClassName}`)} />
      : state == State.RECORDING ? 
        <button
          className={`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      : state == State.WAITING ? 
        <button
          className={`mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}
          onClick={startRecording}
        >
          Start Recording
        </button>
      : state == State.CORRECTING ?
        <input
          className={`mt-2 p-3 rounded-sm border-sign-speak-teal border`}
          onSubmit = {submitCorrection}
          onKeyUp = {e => e.key == "Enter" ? submitCorrection() : null}
          onChange = {e => setCorrection(e.target.value)}
          defaultValue = {interpretation ?? ""}
        />
      :
        <div className="flex flex-row justify-center">
          <button onClick={() => submitGood(true)} className={`mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}>Good</button>
          <button onClick={() => submitGood(false)} className={`mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}>Bad</button>
          <button onClick={() => submitGood(null)} className={`mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ${containerClassName}`}>Skip</button>
        </div>
      }
    </div>
  );
};