// Components
export { SignProduction } from "./components/SignProduction";
export { SignRecognition } from "./components/SignRecognition";
export { SpeechRecognition } from "./components/SpeechRecognition";
export { SpeechProduction } from "./components/SpeechProduction";

// Hooks
export { useSpeechRecognition } from "./hooks/sttHook";
export { useSignLanguageRecognition } from "./hooks/slrHook";
export { useSpeechProduction } from "./hooks/ttsHook";
export { useSignProduction } from "./hooks/slpHook";

// Network utilities
export * from "./network/rest";
export * from "./network/websockets";
export * from "./network/key";