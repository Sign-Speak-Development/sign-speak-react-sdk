import axios, { ResponseType } from "axios";
import { getKey } from "./key";

const API_ENDPOINT = "http://localhost:8000"

export async function recognizeSign(vidB64: string, model: string = "LATEST"): Promise<string> {
    let res = (await runRequest("/recognize-sign", {
        payload: vidB64,
        single_recognition_mode: true,
        request_class: "BLOCKING",
        model: model
    }));
    return res["prediction"][0]["prediction"] as string;
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
export async function produceSign(eng: string, model: string = "MALE"): Promise<Blob> {
    let res = (await runRequest("/produce-sign", {
        english: eng,
        request_class: "BLOCKING",
        model: model
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
async function runRequest(request: string, payload: any, responseType: ResponseType | undefined = "json"): Promise<any> {
    let resp = (await axios.post(API_ENDPOINT + request, payload, {
        headers: {
            "X-api-key": getKey(),
        },
        responseType: responseType
    }));
    if (resp.status == 202) {
        let req_id = responseType == undefined ? resp.data["batch_id"] : JSON.parse(await (resp?.data)?.text());
        while (true) {
            let resp = await axios.get(API_ENDPOINT + request + req_id, {
                headers: {
                    "X-api-key": getKey(),
                },
                responseType: responseType
            }
            );
            if (resp.status == 202) {
                // job is not done yet, let's poll again
                continue
            }
            return resp.data;
        }
    } else {
        return resp.data;
    }

}