import { getKey } from "./key";
import { RecognitionResult } from "./rest";

export interface SignLanguageRecognitionWebsocketConfig {
    sliceLength?: number; // in milliseconds, default: 500
    singleRecognitionMode?: boolean;
    model?: string;
    deviceId?: string; // Optional: specify a MediaDeviceId to use a particular camera
    [key: string]: any; // Allow extra configuration details
}

export class SignSpeakWebSocket {
    private socket: WebSocket | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private stream: MediaStream | null = null;
    private isConnected = false;
    private onPrediction: (prediction: RecognitionResult) => void;

    constructor(
        private config: SignLanguageRecognitionWebsocketConfig,
        onPrediction: (prediction: RecognitionResult) => void
    ) {
        this.onPrediction = onPrediction;
    }

    /**
     * Initializes the WebSocket connection.
     */
    async connect(): Promise<void> {
        if (this.isConnected) {
            console.warn("WebSocket already connected.");
            return;
        }

        this.socket = new WebSocket("wss://api.sign-speak.com/stream-recognize-sign");

        return new Promise((resolve, reject) => {
            this.socket!.addEventListener("open", () => {
                // Send configuration details including API key and any other custom settings.
                const { deviceId, includeFeedback, singleRecognitionMode, model, sliceLength, ...configWithoutDeviceId } = this.config;
                this.socket!.send(JSON.stringify({
                    api_key: getKey(), 
                    model: model,
                    single_recognition_mode: singleRecognitionMode ?? false,
                    slice_length: sliceLength ?? 500,
                    ...configWithoutDeviceId
                }));
                this.isConnected = true;
                resolve();
            });

            this.socket!.addEventListener("error", (err) => {
                reject(err);
            });

            this.socket!.addEventListener("message", (event) => this.handleMessage(event));
        });
    }

    /**
     * Handles incoming messages from the WebSocket.
     */
    private handleMessage(event: MessageEvent) {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (err) {
            console.warn("Received non-JSON from recognition socket:", event.data);
            return;
        }

        if (data === "OUT_OF_QUOTA") {
            console.error("SignSpeak quota exceeded.");
            return;
        }

        this.onPrediction(data);
    }

    /**
     * Streams live video from a MediaDevice.
     * If a deviceId is specified in the config, it will be used.
     */
    async streamLiveVideo(): Promise<void> {
        if (!this.isConnected) {
            throw new Error("WebSocket connection not established. Call `connect()` first.");
        }

        const constraints: MediaStreamConstraints = {
            video: this.config.deviceId
                ? { deviceId: { exact: this.config.deviceId } }
                : true,
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);

        const isChrome = navigator.userAgent.includes("chrome") &&
            !navigator.userAgent.includes("edge") &&
            !navigator.userAgent.includes("opr") &&
            !navigator.userAgent.includes("crios");

        const options: MediaRecorderOptions = isChrome
            ? { bitsPerSecond: 1_000_000, mimeType: "video/webm;codecs=VP9" }
            : { bitsPerSecond: 1_000_000 };

        this.mediaRecorder = new MediaRecorder(this.stream, options);

        this.mediaRecorder.ondataavailable = (e) => {
            const blob = new Blob([e.data], { type: "video/mp4" });
            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onloadend = () => {
                if (reader.result && this.socket) {
                    this.socket.send(reader.result as ArrayBuffer);
                }
            };
        };

        this.mediaRecorder.start(this.config.sliceLength ?? 500);
    }

    /**
     * Streams video segments over the WebSocket asynchronously.
     * Accepts an async iterable (or generator) that yields video segments (File or Blob)
     * one at a time. Each segment is sent over the WebSocket with a delay matching sliceLength.
     *
     * This method can be used instead of streamLiveVideo() if you wish to provide
     * your own video segments asynchronously.
     *
     * @param videoStream An async iterable of video segments (File or Blob).
     */
    async streamVideoSegments(videoStream: AsyncIterable<File | Blob>): Promise<void> {
        if (!this.isConnected) {
            throw new Error("WebSocket connection not established. Call `connect()` first.");
        }

        for await (const video of videoStream) {
            const arrayBuffer = await video.arrayBuffer();
            this.socket?.send(arrayBuffer);
        }
    }

    /**
     * Stops the streaming process and sends a termination signal.
     * @param closeSocket If true, the WebSocket connection will close.
     */
    stopStreaming(closeSocket: boolean = true): void {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
        } else {
            console.warn("No active media recording to stop.");
        }
        this.stream?.getTracks().forEach((track) => track.stop());

        if (this.socket) {
            this.socket.send(closeSocket ? "DONE" : "NEXT");
            if (closeSocket) {
                this.disconnect();
            }
        }
    }

    /**
     * Disconnects the WebSocket.
     */
    disconnect(): void {
        if (this.isConnected) {
            this.socket?.close();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

/**
 * Utility function to delay execution.
 * @param ms Milliseconds to delay.
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}