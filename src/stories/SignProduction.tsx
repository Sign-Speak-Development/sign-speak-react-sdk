import { useEffect, useRef, useState } from 'react';
import { produceSign } from '../network/adapter';
import { twMerge } from 'tailwind-merge';

export interface SignProductionProps {
  modelName?: string
  text: string
  play?: boolean
  videoClassName?: string
  videoContainerClassName?: string
  loadingClassName?: string
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
  videoContainerClassName="",
  loadingClassName="",
  ...props
}: SignProductionProps) => {
  const [videos, setVideos] = useState<Blob[] | null>(null);
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(-1)
  const [finishedPlaying, setFinishedPlaying] = useState(-1)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    (async () => {
      let textSplit = text.split(/[.!?]/);
      setLoading(true)
      setVideos([])
      setCurrentVideoPlaying(-1)
      setFinishedPlaying(-1)
      let videos: Blob[] = []
      let textToRender = ""
      for (let textIdx in textSplit) {
        let text = (textSplit[textIdx] + ".").trim()
        textToRender += (" " + text).trim()
        if (textToRender.split(" ").length < 8 || textToRender.trim().length == 0) {
          continue
        }
        let result = await produceSign(textToRender, modelName)
        videos.push(result)
        setVideos([...videos])
        textToRender = ""
      }
      if (textToRender.trim().length > 2) {
        let result = await produceSign(textToRender, modelName)
        videos.push(result)
        setVideos([...videos])
      }
      setLoading(false)
    })()
  }, [text])
  const playVideo = (idx: number) => {
    if (videos == null) {
      return
    }
    if (videoRef.current == null) {
      return
    }

    let video = videos[idx]
    onPlaying()
    setCurrentVideoPlaying(idx)
    const videoURL = URL.createObjectURL(video);
    videoRef.current.src = videoURL;
    videoRef.current.play()

    videoRef.current.onended = () => {
      onStopped();
      setFinishedPlaying(idx)
    };

  }
  useEffect(() => {
    if (play && videos != null && videoRef.current != null) {
      let numVideos = videos.length
      // our video is done playing and we have a video available
      if (currentVideoPlaying == finishedPlaying && numVideos - 1 > currentVideoPlaying) {
        playVideo(currentVideoPlaying + 1)
      }
    }
  }, [videos, play, currentVideoPlaying, finishedPlaying])
  return <div className={twMerge("flex flex-col", videoContainerClassName)}>
    <video muted ref={videoRef} className={videoClassName} />
    {
      loading && currentVideoPlaying == finishedPlaying ? <p className={loadingClassName}>loading...</p> : null
    }
  </div>
};