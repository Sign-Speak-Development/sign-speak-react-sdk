import { useEffect, useRef, useState } from "react";
import { useSignProduction } from "@sign-speak/react-sdk";

export interface SignProductionProps {
  text: string;
  model?: string | null;
  videoContainerClassName?: string;
  videoClassName?: string;
  loadingClassName?: string;
}

export const SignProduction: React.FC<SignProductionProps> = ({
  text,
  model,
  videoContainerClassName = "",
  videoClassName = "",
  loadingClassName = "",
}) => {
  const { triggerProduction, loading, blob } = useSignProduction();
  const [blobURL, setBlobURL] = useState<string>()

  useEffect(() => {
    if (blob) {
      setBlobURL(URL.createObjectURL(blob))
    }
  }, [blob])

  // When the text changes, split it into segments and produce a sign video for each.
  useEffect(() => {
    triggerProduction({
      english: text,
    }, {
      model: model ?? undefined
    })
  }, [text]);

  return (
    <div className={videoContainerClassName}>
      {
        blob == null || loading?
            <div className={loadingClassName} />
          :
            <video src={blobURL} muted autoPlay className={videoClassName} />
      }
    </div>
  );
};