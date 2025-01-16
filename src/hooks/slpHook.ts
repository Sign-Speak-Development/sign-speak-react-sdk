import { useState } from "react";
import { produceSign, TimestampedEnglish } from "../network/rest";

export function useSignProduction() {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  /**
   * Triggers sign language production based on the provided input.
   *
   * @param input - An object containing either `english` or `timestamped_english` (or both).
   * @param options - Optional parameters such as `model`
   * @returns A Promise that resolves with a Blob containing the produced sign language video.
   */
  const triggerProduction = async (
    input: { english?: string; timestamped_english?: TimestampedEnglish[] },
    options?: { model?: string; [key: string]: any }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const producedBlob = await produceSign(input, options);
      setBlob(producedBlob);
      return producedBlob;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { blob, loading, error, triggerProduction };
}