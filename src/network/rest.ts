import { getKey } from "./key";

const API_BASE = "https://api.sign-speak.com";

// Utility function for delaying polling iterations
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** ***************** Recognition Types & Functions ******************** */

/** Type for each prediction in recognition responses */
export interface RecognitionPrediction {
  feedback_id: string;
  timestamp_start_sec: number | null;
  timestamp_end_sec: number | null;
  finished: boolean;
  prediction: string;
  confidence: number; // log-prob value
}

/** Type for recognition results */
export interface RecognitionResult {
  feedback_id: string;
  prediction: RecognitionPrediction[];
}

/**
 * Recognize sign language from a base64-encoded video.
 * @param vidB64 Base64-encoded video string.
 * @param options Optional parameters (e.g., model, language, additional customizations).
 * @returns The full recognition result containing feedback and detailed predictions.
 */
export async function recognizeSign(
  vidB64: string,
  options?: { model?: string; [key: string]: any }
): Promise<RecognitionResult> {
  const payload = {
    payload: vidB64,
    single_recognition_mode: true,
    request_class: "BLOCKING",
    model: options?.model ?? "LATEST",
    ...options,
  };

  const res = await runRequest("/recognize-sign", payload);
  return res as RecognitionResult;
}

/**
 * Recognize speech from a base64-encoded audio.
 * @param audioB64 Base64-encoded audio string.
 * @param options Optional parameters (e.g., model, language, additional customizations).
 * @returns The full recognition result containing feedback and detailed predictions.
 */
export async function recognizeSpeech(
  audioB64: string,
  options?: { model?: string; language?: string; [key: string]: any }
): Promise<RecognitionResult> {
  const payload = {
    payload: audioB64,
    single_recognition_mode: true,
    request_class: "BLOCKING",
    model: options?.model ?? "LATEST",
    language: options?.language ?? "en",
    ...options,
  };

  const res = await runRequest("/recognize-speech", payload);
  return res as RecognitionResult;
}

export async function submitFeedback(
  feedbackId: string,
  rating?: "GOOD" | "BAD",
  correction?: string
): Promise<void> {
  // If neither feedback nor correction is provided, there's nothing to submit.
  if (!rating && !correction) {
    return;
  }
  
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("X-api-key", getKey()!);

  const payload = {
    rating: rating || "",
    correction: correction || ""
  };

  const options: RequestInit = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(payload)
  };

  await fetch(`${API_BASE}/feedback/${feedbackId}`, options);
}

/** ***************** Production Types & Functions ******************** */

/** Type for timestamped english entries (reuse from previous definitions) */
export interface TimestampedEnglish {
  text: string;
  start_sec: number;
  end_sec: number;
}

/**
 * Produce sign language video.
 * Supports providing either a plain english string or timestamped english.
 * @param input An object containing either `english` or `timestamped_english` (or both).
 * @param options Optional parameters (e.g., model or additional customizations).
 * @returns A Blob containing the generated sign video.
 */
export async function produceSign(
  input: { english?: string; timestamped_english?: TimestampedEnglish[] },
  options?: { model?: string; [key: string]: any }
): Promise<Blob> {
  if (options == null) {
    options = {}
  }
  if (options.model == undefined) {
    options.model = "MALE"
  }
  const payload = {
    request_class: "BLOCKING",
    resolution: 512,
    ...input,
    ...options,
  };

  return await runRequest("/produce-sign", payload, "blob");
}

/**
 * Produce speech audio.
 * Supports providing either a plain english string or timestamped english.
 * @param input An object containing either `english` or `timestamped_english` (or both).
 * @param options Optional parameters (e.g., model, additional customizations).
 * @returns A Blob containing the generated speech audio.
 */
export async function produceSpeech(
  input: { english?: string; timestamped_english?: TimestampedEnglish[] },
  options?: { model?: string; [key: string]: any }
): Promise<Blob> {
  if (options == null) {
    options = {}
  }
  if (options.model == undefined) {
    options.model = "MALE"
  }
  const payload = {
    request_class: "BLOCKING",
    ...input,
    ...options,
  };

  return await runRequest("/produce-speech", payload, "blob");
}

/** ***************** Media Generation Types & Function ******************** */

/** Represents the output type returned by the media generation endpoint */
export interface MediaOutputType {
  output_path: string;
  feedback_id?: string;
}

/** Media generation request */
export interface MediaGenRequest {
  input: MediaInputGenRequest;
  output: MediaOutput;
}

/** Discriminated union for media input types */
export type MediaInputGenRequest =
  | { type: "Text"; value: MediaInputGenTextInput }
  | { type: "Audio"; value: MediaInputGenAudioInput }
  | { type: "Video"; value: MediaInputGenVideoInput }
  | { type: "MultiRequest"; value: MediaInputMultiRequest };

/** Multi-request input allowing multiple types together */
export interface MediaInputMultiRequest {
  text?: MediaInputGenTextInput;
  video?: MediaInputGenVideoInput;
  audio?: MediaInputGenAudioInput;
}

/** Discriminated union for media output types */
export type MediaOutput =
  | { type: "Video"; value: MediaOutputVideo };

/** Video-specific output configuration for media generation */
export interface MediaOutputVideo {
  include_captions?: boolean;
  caption_config?: CaptionConfig;
  video_config?: VideoConfig;
  audio_synth_config?: ProductionModels;
  video_synth_config?: ProductionModels;
}

/** Configuration for captions */
export interface CaptionConfig {
  caption_location: Location;
  font_size: number;
  text_color: [number, number, number, number];
  background_color: [number, number, number, number];
}

/** Location enum for caption placement */
export enum Location {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

/** Video configuration options */
export interface VideoConfig {
  logo_b64?: string;
}

/** Media input for text (supports a single group or multiple timestamped inputs) */
export type MediaInputGenTextInput =
  | { type: "SingleGroup"; value: string }
  | { type: "TimestampedInputs"; value: TimestampedEnglishGroup[] };

/** Media input for audio */
export interface MediaInputGenAudioInput {
  audio: string;
}

/** Media input for video */
export interface MediaInputGenVideoInput {
  video: string;
}

/** A group of timestamped english text inputs */
export interface TimestampedEnglishGroup {
  text: string;
  start_sec: number;
  end_sec: number;
}

/** Placeholder type for production models (adjust as needed) */
export type ProductionModels = any;

/**
 * Generate media (e.g., video) from a complex media generation request.
 * Accepts a MediaGenRequest payload and returns a Blob containing the generated media.
 * @param request A MediaGenRequest object.
 * @param options Optional additional parameters for customization.
 * @returns A Blob containing the generated media.
 */
export async function genMedia(
  request: MediaGenRequest,
  options?: { [key: string]: any }
): Promise<Blob> {
  // Merge any additional options into the payload
  const payload = { ...request, ...options };
  return await runRequest("/gen-media", payload, "blob");
}

/** ***************** Internal Request Handler ******************** */

/**
 * Internal helper to run a request to the Sign-Speak API.
 * This function also supports polling for asynchronous operations.
 *
 * @param endpoint REST endpoint (e.g., "/recognize-sign")
 * @param payload Payload for the request.
 * @param responseType Expected response type ("json" or "blob").
 * @param pollInterval Polling interval in milliseconds.
 * @param maxPolls Maximum number of polling attempts.
 * @returns The API response.
 */
export async function runRequest(
  endpoint: string,
  payload: any,
  responseType: "json" | "blob" = "json",
  pollInterval: number = 1000,
  maxPolls: number = 30
): Promise<any> {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("X-api-key", getKey()!);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${API_BASE}${endpoint}`, requestOptions);

  if (!response.ok && response.status !== 202) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  let data: any;
  if (responseType === "blob") {
    data = await response.blob();
  } else {
    data = await response.json();
  }

  // If the response indicates the job is queued (202), start polling for the result.
  if (response.status === 202) {
    const batchId = data.batch_id;
    let polls = 0;
    while (polls < maxPolls) {
      await delay(pollInterval);
      response = await fetch(`${API_BASE}${endpoint}/${batchId}`, { headers: requestHeaders });
      if (response.ok && response.status !== 202) {
        if (responseType === "blob") {
          data = await response.blob();
          if ((data as Blob).size === 0) {
            polls++;
            continue;
          }
        } else {
          data = await response.json();
        }
        return data;
      }
      polls++;
    }
    throw new Error("Polling exceeded maximum attempts");
  }

  return data;
}