import { getKey } from "./key";

const API_ENDPOINT = "https://api.sign-speak.com"

export async function recognizeSign(vidB64: string, model: string = "LATEST"): Promise<[string, string]> {
    let res = (await runRequest("/recognize-sign", {
        payload: vidB64,
        single_recognition_mode: true,
        request_class: "BLOCKING",
        model: model
    }));
    return [res["prediction"][0]["prediction"] as string, res["feedback_id"]];
}

export async function submitFeedback(feedbackId: string, good: boolean|null, correction: string|null): Promise<void> {
    if (good === null && correction === null) {
        return
    }

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('X-api-key', getKey()!);
    const options: RequestInit = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            good: good,
            correction: correction
        }),
    };

    await fetch(API_ENDPOINT + "/feedback/" + feedbackId, options)
}

export async function recognizeSpeech(audioB64: string, model: string = "LATEST"): Promise<string> {
    let res = (await runRequest("/recognize-speech", {
        payload: audioB64,
        single_recognition_mode: true,
        request_class: "BLOCKING",
        model: model
    }));
    return res["prediction"][0]["prediction"] as string;
}

export async function produceSign(eng: string, model: string = "MALE", resolution: number = 512): Promise<Blob> {
    let res = (await runRequest("/produce-sign", {
        english: eng,
        request_class: "BLOCKING",
        model: model,
        resolution: resolution
    }, 'blob'));
    return res;
}

export async function produceSpeech(eng: string, model: string = "MALE"): Promise<Blob> {
    let res = (await runRequest("/produce-speech", {
        english: eng,
        request_class: "BLOCKING",
        model: model
    }, 'blob'));
    return res;
}

async function runRequest(request: string, payload: any, responseType: string | undefined = "json"): Promise<any> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('X-api-key', getKey()!);

    const options: RequestInit = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(payload),
    };

    let response = await fetch(API_ENDPOINT + request, options);
    let data;

    if (responseType === 'blob') {
        data = await response.blob();
    } else {
        const jsonData = await response.json();
        data = jsonData;
    }

    if (response.status === 202) {
        let req_id = data["batch_id"];
        while (true) {
            response = await fetch(API_ENDPOINT + request + "/" + req_id, {
                headers: requestHeaders,
            });

            if (response.status === 202) {
                // If job is not done yet, let's poll again.
                continue;
            } else {
                if (responseType === 'blob') {
                    let result = await response.blob();
                    if (result.size == 0) {
                        continue
                    }
                } else {
                    return response.json();
                }
            }
        }
    } else {
        return data;
    }
}
