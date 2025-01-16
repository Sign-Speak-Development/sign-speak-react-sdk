import React, { useEffect } from "react";
import { useSpeechProduction } from "../hooks/ttsHook";

export interface SpeechProductionProps {
  model?: string;
  text: string;
  play?: boolean;
  onLoaded?: () => void;
  onPlaying?: () => void;
  onStopped?: () => void;
}

export const SpeechProduction: React.FC<SpeechProductionProps> = ({
  model = "MALE",
  text,
  play = true,
  onLoaded = () => {},
  onPlaying = () => {},
  onStopped = () => {},
}) => {
  const { blob, triggerProduction } = useSpeechProduction();

  // Trigger speech production when text or model changes.
  useEffect(() => {
    triggerProduction({ english: text }, { model: model })
      .then(() => {
        onLoaded();
      })
      .catch((err) => {
        console.error("Error producing speech:", err);
      });
  }, [text, model]);

  // When blob is ready and play is true, create an audio element to play it.
  useEffect(() => {
    if (play && blob) {
      onPlaying();
      const audioUrl = URL.createObjectURL(blob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl);
        onStopped();
      };
    }
  }, [blob, play]);

  return null;
};