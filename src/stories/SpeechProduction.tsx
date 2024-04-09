import { useEffect, useState } from 'react';
import { produceSpeech } from '../network/adapter';

export interface SpeechProductionProps {
  modelName?: string
  text: string
  play?: boolean
  onLoaded?: () => void
  onPlaying?: () => void
  onStopped?: () => void
}

export const SpeechProduction = ({
  modelName = "MALE",
  text,
  play=true,
  onLoaded=()=>{},
  onPlaying=()=>{},
  onStopped=()=>{},
  ...props
}: SpeechProductionProps) => {
  const [audio, setAudio] = useState<Blob | null>(null);
  useEffect(() => {
    produceSpeech(text, modelName).then((x) => {
      setAudio(x);
      onLoaded();
    });
  }, [text])
  useEffect(() => {
    if (play && audio != null) {
      onPlaying()
      const audioUrl = URL.createObjectURL(audio);
      const audioElement = new Audio();
      audioElement.src = audioUrl;
      audioElement.play()

      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl);
        onStopped();
      };
    }

  }, [audio, play])
  return null
};