import React, { useEffect } from "react";
import { useSpeechRecognition } from "../hooks/sttHook";
import { RecognitionResult } from "../network/rest";

export interface SpeechRecognitionProps {
  model?: string,
  onResult?: (result: RecognitionResult | null) => void | null;
  containerClassName?: string;
  transcriptionClassName?: string;
  errorClassName?: string;
  loadingClassName?: string;
  buttonClassName?: string;
}

export const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  onResult,
  model,
  containerClassName = "",
  transcriptionClassName = "",
  errorClassName = "",
  loadingClassName = "",
  buttonClassName = "",
}) => {
  const {
    startRecognition,
    stopRecognition,
    prediction,
    loading,
    error,
    recording,
  } = useSpeechRecognition({
    model: model
  });

  // Invoke onResult callback when transcription updates.
  useEffect(() => {
    if (prediction && onResult) {
      onResult(prediction);
    }
  }, [prediction, onResult]);

  const transcription = prediction?.prediction.map(x => x.prediction).join(" ")

  return (
    <div className={containerClassName}>
      {transcription && (
        <p className={transcriptionClassName}>
          {transcription}
        </p>
      )}
      {error && (
        <p className={errorClassName}>
          {error.message}
        </p>
      )}
      {loading ? (
        <div
          className={loadingClassName}
        />
      ) : recording ? (
        <button
          className={buttonClassName}
          onClick={stopRecognition}
        >
          Stop Listening
        </button>
      ) : (
        <button
          className={buttonClassName}
          onClick={startRecognition}
        >
          Start Listening
        </button>
      )}
    </div>
  );
};