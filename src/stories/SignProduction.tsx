import { useEffect, useRef, useState } from 'react';
import { produceSign } from '../network/adapter';

export interface SignProductionProps {
  modelName?: string
  text: string
  play?: boolean
  videoClassName?: string
  onLoaded?: () => void
  onPlaying?: () => void
  onStopped?: () => void
}

export const SignProduction = ({
  modelName = "MALE",
  text,
  play=true,
  onLoaded=()=>{},
  onPlaying=()=>{},
  onStopped=()=>{},
  videoClassName="",
  ...props
}: SignProductionProps) => {
  const [video, setVideo] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    produceSign(text, modelName).then((x) => {
      setVideo(x);
      onLoaded();
    });
  }, [text])
  useEffect(() => {
    if (play && video != null && videoRef.current != null) {
      onPlaying()
      const videoURL = URL.createObjectURL(video);
      videoRef.current.src = videoURL;
      videoRef.current.play()

      videoRef.current.onended = () => {
        onStopped();
      };
    }
  }, [video, play])
  return <video muted ref={videoRef} className={videoClassName} />
};