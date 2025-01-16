## Sign-Speak JavaScript SDK

Official JavaScript SDK for Sign-Speak. Unlock seamless integration of American Sign Language (ASL) sign recognition, avatars, and speech recognition in your app. Experience world-class AI technology that’s accurate, robust, and easy to implement—everything you need to elevate your app in one powerful SDK.

Explore our complete [API documentation](https://app.theneo.io/sign-speak/sign-speak-api/api-specifications) and learn about implementation and benchmarks in our [Standards](https://sign-speak.com/research/Standards.pdf) and [Efficiency](https://sign-speak.com/research/Efficency.pdf) research papers.

For a preview of what you can do with the SDK, this is our avatar (I know, it looks human, right!):
![image](https://i.imgur.com/Zdzej3b.gif)

And this is our Sign Language Recognition:
![image](https://i.imgur.com/gb9S6M6.gif)

### What Can You Build?
1. [Sign Language-Powered AI Chatbots (e.g., ASL GPT)](https://drive.google.com/file/d/1fM_ouBtWat-JIgirkdW9SQp3-MpKG_kp/view?resourcekey)
2. [Automatic Captioning for Deaf Content Creators](https://drive.google.com/file/d/1B-inL-X7MqY2WZX5C5RDT-WMK5_bU-qq/view?resourcekey)
3. …and much more! think TV sign commands... 

Start building with the Sign-Speak SDK today and unlock the true power of a visual language. After all, why settle for basic gesture recognition when you have a rich, expressive language at your fingertips? Create immersive experiences that transcend accessibility and redefine interaction.

### New Features & Capabilities

The Sign-Speak SDK offers four main capabilities:

- **ASL Recognition**: Transforms ASL video streams into accurate English transcripts.
- **ASL Production**: Generates realistic ASL avatar videos from English text.
- **English Speech Recognition (Speech-to-Text)**: Efficiently converts spoken English audio into text.
- **English Speech Generation (Text-to-Speech)**: Creates natural-sounding English speech audio files (MP3) from text.

### Installation

#### Using npm or yarn
```bash
npm install @sign-speak/react-sdk
# -or-
yarn add @sign-speak/react-sdk
```

### Initialization & API Key setup
Learn how to obtain your API keys at your [Sign-Speak developer portal](https://client.sign-speak.com).

#### Setting the API Key
```javascript
import { setKey } from 'sign-speak-sdk/network/key';

// set the API Key programmatically
setKey('YOUR_API_KEY');
```

or via environment variables:
```
SIGN_SPEAK_API_KEY="YOUR_API_KEY"
```

## Considerations & Best Practices

Sign-Speak delivers advanced ASL recognition and speech processing tools for seamless integration. For optimal accuracy and performance in your application, follow these best practices and be mindful of the current limitations.

### Recommended Best Practices:

- **Use conversational ASL**:   
  Our models achieve best results with natural, conversational signing at normal pace. Avoid instructional or artificially slow signing—this typically decreases recognition accuracy. 

- **Proper video positioning**:  
  Use well-lit environments and landscape videos that clearly capture the signer, keeping them centered and showing their full upper body. This positioning ensures accurate predictions. You can see an example of a good video positioning on the [API documentation](https://app.theneo.io/sign-speak/sign-speak-api/api-specifications/asl-recognition).

- **Start small, then scale**:   
  Initially test your integration with short, simple statements. Once familiar and successful, gradually progress to longer and more complex interactions to ensure continued accuracy and responsiveness.

### ⚠️ Known Limitations and Caveats:

- **Personal Sign Names**:
Recognition accuracy for personalized sign names is currently limited, with standardized and widely accepted signs providing the best results. However, with proper consent, we can train a custom model for individual users to recognize unique elements like their sign name.

- **Video and Audio Quality**:
  Background noise, low-quality audio, poor lighting, or unclear framing significantly detract from accuracy. For best results, strive for clear audio and stable, well-lit video streams.

- **API Usage & Quotas**:
  Be aware your account includes default rate-limits (requests per minute) and monthly quotas (processed minutes). Check usage consistently on your [developer dashboard](https://client.sign-speak.com), or contact [management@sign-speak.com](mailto:management@sign-speak.com) if you require higher limits.

- **Real-time latency and streaming**:
  While our WebSocket protocol is designed for low latency, network conditions or browser limitations can impact smooth real-time interaction. Thorough testing across supported browsers and networks is recommended.

- **Limited Feature Availability**:
  Certain advanced functionalities (like personalized avatars, specific regional variants, and custom fine-tuning) are available under limited or partnership arrangements. Please reach out to discuss specific use-cases or special requirements.

### Further Reading and Documentation:

For detailed performance standards and efficiency insights, visit:
- [Sign-Speak Standards Documentation](https://sign-speak.com/research/Standards.pdf)
- [Sign-Speak Efficiency Benchmarks](https://sign-speak.com/research/Efficency.pdf)
- [Sign-Speak Documentation](https://app.theneo.io/sign-speak/sign-speak-api/api-specifications)

---

Following these key recommendations and understanding our current limitations will ensure you maximize the effectiveness and accuracy of the Sign-Speak platform SDK in your applications. For more questions or support, feel free to contact our team at [management@sign-speak.com](mailto:management@sign-speak.com).

---

## Usage Examples

### 1. Framework-ready Components (React)

Quickly integrate with React:

#### ASL Recognition (video → text)
```jsx
import { SignRecognition } from 'sign-speak-sdk';

const MyASLRecognition = () => (
  <div>
    <h2>ASL Recognition</h2>
    <SignRecognition />
  </div>
);
```

#### ASL Production (text → ASL avatar video)
```jsx
import { SignProduction } from 'sign-speak-sdk';

const MyASLProduction = () => (
  <div>
    <h2>Generate ASL</h2>
    <SignProduction text="Hello, how are you?" model="MALE" />
  </div>
);
```

#### Speech-to-Text
```jsx
import { SpeechRecognition } from 'sign-speak-sdk';

const MySpeechRecognition = () => (
  <div>
    <h2>English Speech Recognition</h2>
    <SpeechRecognition />
  </div>
);
```

#### Text-to-Speech
```jsx
import { SpeechProduction } from 'sign-speak-sdk';

const MyTextToSpeech = () => (
  <div>
    <h2>Text to Speech</h2>
    <SpeechProduction text="Hello from Sign-Speak." model="FEMALE" />
  </div>
);
```

---

### 2. React Hooks Usage

Simplify state management and API calls via React hooks:

#### useSignLanguageRecognition
```jsx
import React, { useEffect } from 'react';
import { useSignLanguageRecognition } from 'sign-speak-sdk';

function ASLHookExample() {
  const { prediction, startRecognition, stopRecognition, recording, loading } = useSignLanguageRecognition();
  const interpretation = prediction?.prediction.filter(x => x.confidence > Math.log(0.5)).map(x => x.prediction).join(" ");

  return (
    <div>
      {
        loading ? <p>loading...</p> : (
          recording ? 
            <button onClick={stopRecognition}>Stop Watching</button> : 
            <button onClick={startRecognition}>Start Watching</button>
        )
      }

      <p>{interpretation}</p>
    </div>
  );
}
```

#### useSpeechRecognition
```jsx
import React from 'react';
import { useSpeechRecognition } from 'sign-speak-sdk';

function SpeechHookExample() {
  const { prediction, startRecognition, stopRecognition, recording, loading } = useSpeechRecognition();
  const interpretation = prediction?.prediction.filter(x => x.confidence > Math.log(0.5)).map(x => x.prediction).join(" ");

  return (
    <div>
      {
        loading ? <p>loading...</p> : (
          recording ? 
            <button onClick={stopRecognition}>Stop Listening</button> : 
            <button onClick={startRecognition}>Start Listening</button>
        )
      }
      <p>{interpretation}</p>
    </div>
  );
}
```

> *note: analogous hooks exist for ASL production (`useSignProduction`) and Text-to-Speech (`useSpeechProduction`).*

---

### 3. Network API Interaction Examples

#### RESTful ASL Recognition (Blocking)
```javascript
import { recognizeSign } from 'sign-speak-sdk/network/rest';
import { getKey } from 'sign-speak-sdk/network/key';

const videoBase64 = '...'; // Your base64-encoded video
const result = await recognizeSign(videoBase64, {
  request_class: 'BLOCKING',
  model: 'MAIN',
  hint: 'Name is Nikolas.',
  single_recognition_mode: true,
  apiKey: getKey()
});

console.log(result.prediction);
```

#### RESTful ASL Production (Batch - Avatar generation)
```javascript
import { produceSign } from 'sign-speak-sdk/network/rest';

const response = await produceSign({
  english: "Welcome to Sign-Speak!",
}, {
  request_class: "BATCH",
  model: "MALE"
});

console.log("Batch ID:", response.batch_id);
```

#### WebSocket Real-Time ASL Recognition
```javascript
import { SignSpeakWebSocket } from 'sign-speak-sdk/network/websockets';

async function startRealtimeRecognition() {
  const wsConfig = {
    sliceLength: 500,
    singleRecognitionMode: false
  };
  const onASLPrediction = (pred: any) => {
    console.log('Realtime ASL:', pred);
  };

  const socketClient = new SignSpeakWebSocket(wsConfig, onASLPrediction);
  await socketClient.connect()
  await socketClient.streamLiveVideo();
  // record for 5 seconds and then stop
  setTimeout(() => {
    socketClient.stopStreaming(false) // if you set the terminate signal to true here, the socket will close immediately
  }, 5000)
}
```

---

## Request Types and Modes

Sign-Speak provides flexible request classes:

- **BLOCKING (RESTful):** Immediate response; falls back to BATCH if takes longer than ~30 seconds
- **BATCH (RESTful):** Start-and-query later; perfect for large or time-intensive tasks
- **WebSocket (streaming):** Optimized for real-time, latency-sensitive user experiences

---

## Customizing & Configuration
Pass configuration when initializing hooks, components, or WebSockets:

```javascript
const config = {
  sliceLength: 500, // milliseconds video/audio chunks
  singleRecognitionMode: true, 
  deviceId: 'camera-device-id'
};
```

---

## API Keys & Security
- **PRIVATE keys:** Manage API keys, account settings (server-side only)
- **PUBLIC keys:** Used in client-side for inference only
- **ROOT key:** A required administrative key that cannot be removed

Manage keys at [client.sign-speak.com](https://client.sign-speak.com). **Do not expose private keys publicly**. 

---

### Feedback & Continuous Improvement
You can train and improve our models using the SDK feedback system:

```javascript
import { submitFeedback } from 'sign-speak-sdk/network/rest';

await submitFeedback({ 
  feedback_id: "feedback_id_from_response", 
  rating: "GOOD",
  correction: "" 
});
```

---

## Contributing
Interested in contributing? We ❤️ pull requests! Your contributions are always welcome.

We’re a small startup, so while we don’t have a formal code of conduct yet, we ask that you be respectful and collaborative—let’s keep it that way!

To contribute, please follow these steps:

1. Fork the repository
2. Create a feature or bugfix branch (`git checkout -b feat/my-feature`)
3. Commit your improvements and submit a PR

For assistance, reach us at [management@sign-speak.com](mailto:management@sign-speak.com).

---
## Sample Integration
Below shows a quick example integration which builds a translator between ASL and English (note that we use daisyUI and tailwind here to style):
```javascript
import { useEffect, useState } from "react";
import { RecognitionResult, setKey, SignProduction, SignRecognition, SpeechProduction } from "@sign-speak/react-sdk"

export default function Demo({
    apiKey
}: {
    apiKey: string
}) {
    const [directionToASL, setDirectionToASL] = useState(false)
    const [engText, setEngText] = useState("Nice to meet you.")
    const [submittedEngText, setSubmittedEngText] = useState("Nice to meet you.")
    const [recognizedASL, setRecognizedASL] = useState("")
    const [show, setShow] = useState(false)
    useEffect(() => {
        setKey(apiKey)
        setShow(true)
    }, [apiKey])
    const parseSLRResult = (result: RecognitionResult | null) => {
        if (result) {
            setRecognizedASL(result.prediction.filter(x => x.confidence > Math.log(0.5)).map(x => x.prediction).join(" "))
        }
    }
    if (!show) {
        return null
    }
    return <div className="m-5 w-full">
      <div className="flex flex-row items-center">
        <h1 className="font-semibold text-2xl mr-4">Translation Demo</h1>
        <button onClick={() => setDirectionToASL(!directionToASL)} className="btn bg-base-100">{
          directionToASL ? <>
            English to ASL
          </> : <>
            ASL to English
          </>
        } </button>
      </div>
      <div className="flex flex-row justify-center gap-8 w-full mt-4">
        {
          directionToASL ? <>
            <div className="card flex-1">
              <div className="card bg-base-100 w-full p-6">
                <h1 className="font-semibold">English</h1>
                <textarea
                  value={engText}
                  onChange={e => setEngText(e.target.value)}
                  placeholder="Enter Text in English"
                  className="bg-base-200 rounded-lg mt-4 p-2 textarea resize-none"
                />
                <div>
                  <button
                    onClick={() => setSubmittedEngText(engText)}
                    className="btn btn-primary mt-2"
                  >
                    Translate
                  </button>
                </div>
              </div>
            </div>

            <div className="card flex-1">
              <div className="card bg-base-100 p-6 w-full">
                <h1 className="font-semibold mb-4">ASL Translation</h1>
                <SignProduction
                  key="production"
                  videoContainerClassName="w-full relative aspect-video"
                  loadingClassName="w-full h-full absolute left-1/2 -translate-x-1/2 top-0 skeleton"
                  videoClassName="w-full h-full"
                  text={submittedEngText}
                />
              </div>
            </div>
          </> : <>
            <div className="card flex-1">
              <div className="card bg-base-100 w-full p-6">
                <h1 className="font-semibold mb-2">ASL</h1>
                <SignRecognition interpretationClassName="hidden" containerClassName="relative" loadingClassName="absolute w-full h-full absolute top-0 skeleton !rounded-none" buttonClassName={"btn btn-primary"} onResult={parseSLRResult} />
              </div>
            </div>
            <div className="card flex-1">
              <div className="card bg-base-100 p-6 w-full">
                <h1 className="font-semibold mb-4">English Translation</h1>
                <SpeechProduction text={recognizedASL} />
                <p>{recognizedASL}</p>
              </div>
            </div>
          </>
        }
    </div>
  </div>
}
```

---
## The Sign-Speak Story
At Sign-Speak, we're on a mission to make technology truly inclusive. It all started with our Deaf founder asking a simple yet game-changing question: **“Why can’t I just sign to everything that has voice recognition?”**

And then came the second realization: **“Why are we building gesture recognition when we already have a full visual language?”** 🎯

So, instead of making people wave their hands around like they’re casting spells in a video game, we built real ASL recognition—because sign language **is**  a language, not just a bunch of gestures.

This journey has been 9 years in the making, and now, we’re handing you the keys to a groundbreaking SDK that makes ASL integration seamless. Whether you're making an app more accessible or exploring gesture recognition for innovative interactions through ASL, we can't wait to see what you build!