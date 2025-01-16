import React, { useEffect, useRef, useState } from "react";
import { RecognitionResult, useSignLanguageRecognition } from "@sign-speak/react-sdk";

export interface SignRecognitionProps {
  onResult?: (result: RecognitionResult | null) => void | null;
  model?: string | null;
  interpretationClassName?: string;
  containerClassName?: string;
  loadingClassName?: string;
  buttonClassName?: string;
  cameraClassName?: string;
  confidenceThreshold?: number;
}

export const SignRecognition: React.FC<SignRecognitionProps> = ({
  model,
  onResult,
  interpretationClassName = "",
  containerClassName = "",
  loadingClassName = "",
  buttonClassName = "",
  cameraClassName = "",
  confidenceThreshold = Math.log(0.5)
}) => {
  // Create a ref for the video preview element.
  const previewRef = useRef<HTMLVideoElement | null>(null);

  // Initialize the camera preview on mount.
  useEffect(() => {
    async function initPreview() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera for preview:", err);
      }
    }
    initPreview();
    return () => {
      if (previewRef.current && previewRef.current.srcObject) {
        (previewRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Use the custom hook to handle recognition logic.
  const {
    prediction,
    loading,
    error,
    recording,
    startRecognition,
    stopRecognition,
  } = useSignLanguageRecognition({
    model: model ?? undefined,
    sliceLength: 500,
    singleRecognitionMode: false,
  });

  useEffect(() => {
    if (onResult && prediction !== undefined) {
      onResult(prediction)
    }
  }, [prediction])

  // Derive the current interpretation from the received predictions.
  const interpretation = prediction?.prediction.filter(x => x.confidence > confidenceThreshold).map(x => x.prediction).join(" ")

  return (
    <div className={containerClassName}>
      {/* Video preview from the camera */}
      <video
        ref={previewRef}
        autoPlay
        playsInline
        muted
        className={
          cameraClassName
        }
      />
      {/* Display the current interpretation */}
      {interpretation && (
        <p className={interpretationClassName}>
          {interpretation}
        </p>
      )}
      {error && (
        <p className="mt-2 text-red-500">{error.message}</p>
      )}
      {loading && (
        <div className={loadingClassName} />
      )}
      {/* Show recording controls */}
      {!loading && (recording ? (
        <button
          className={buttonClassName}
          onClick={stopRecognition}
        >
          Stop Recording
        </button>
      ) : (
        <button
          className={buttonClassName}
          onClick={startRecognition}
        >
          Start Recording
        </button>
      ))}
    </div>
  );
};