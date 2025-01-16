import { useState, useEffect, useRef } from "react";
import { 
  SignSpeakWebSocket, 
  SignLanguageRecognitionWebsocketConfig 
} from "../network/websockets";
import { RecognitionResult, submitFeedback } from "../network/rest";

export function useSignLanguageRecognition(config?: SignLanguageRecognitionWebsocketConfig) {
  const [prediction, setPrediction] = useState<RecognitionResult | null>();
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);

  const configRef = useRef(config ?? {})

  // Store the WebSocket instance in a ref to persist across renders.
  const websocketRef = useRef<SignSpeakWebSocket | null>(null);

  // Establish a WebSocket connection.
  const connect = async () => {
    try {
      websocketRef.current = new SignSpeakWebSocket(configRef.current, (newResult: RecognitionResult) => {
        setLoading(false);
        setPrediction(newResult)
      });
      await websocketRef.current.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Start live streaming from the user's camera.
  const startRecognition = async () => {
    try {
      if (!websocketRef.current || !isConnected) {
        await connect();
      }
      await websocketRef.current!.streamLiveVideo();
      setRecording(true);
    } catch (err) {
      setError(err);
    }
  };

  // Stop the streaming process but leave the connection open for reuse.
  const stopRecognition = () => {
    if (websocketRef.current) {
      // Passing 'false' prevents closing the socket.
      websocketRef.current.stopStreaming(false);
      setRecording(false);
      setLoading(true);
    }
  };

  // Disconnect the WebSocket connection.
  const disconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.disconnect();
      setIsConnected(false);
    }
  };

  // Clear all received prediction and feedback ID.
  const clearPrediction = () => {
    setPrediction(null);
    setFeedbackId(null);
  };

  // Reconnect by disconnecting and then reconnecting.
  const reconnect = async () => {
    disconnect();
    await connect();
  };

  // Submit feedback using the REST API.
  // `rating` should be "GOOD" or "BAD". The correction is optional.
  const submitFeedbackAction = async (rating?: "GOOD" | "BAD", correction?: string) => {
    if (!feedbackId) return;
    try {
      await submitFeedback(feedbackId, rating, correction);
      // Optionally, clear feedbackId after submission.
      setFeedbackId(null);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Automatically connect on mount and cleanup on unmount.
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    configRef.current = config ?? {}
  }, [config])

  return {
    prediction,
    loading,
    error,
    isConnected,
    recording,
    startRecognition,
    stopRecognition,
    disconnect,
    clearPrediction,
    reconnect,
    submitFeedback: submitFeedbackAction,
  };
}