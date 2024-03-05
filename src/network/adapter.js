"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceSpeech = exports.produceSign = exports.recognizeSpeech = exports.recognizeSign = void 0;
var axios_1 = __importDefault(require("axios"));
var key_1 = require("./key");
var API_ENDPOINT = "http://localhost:8000";
function recognizeSign(vidB64, model) {
    if (model === void 0) { model = "LATEST"; }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runRequest("/recognize-sign", {
                        payload: vidB64,
                        single_recognition_mode: true,
                        request_class: "BLOCKING",
                        model: model
                    })];
                case 1:
                    res = (_a.sent());
                    return [2 /*return*/, res["prediction"][0]["prediction"]];
            }
        });
    });
}
exports.recognizeSign = recognizeSign;
function recognizeSpeech(audioB64, model) {
    if (model === void 0) { model = "LATEST"; }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runRequest("/recognize-speech", {
                        payload: audioB64,
                        single_recognition_mode: true,
                        request_class: "BLOCKING",
                        model: model
                    })];
                case 1:
                    res = (_a.sent());
                    return [2 /*return*/, res["prediction"][0]["prediction"]];
            }
        });
    });
}
exports.recognizeSpeech = recognizeSpeech;
function produceSign(eng, model) {
    if (model === void 0) { model = "MALE"; }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runRequest("/produce-sign", {
                        english: eng,
                        request_class: "BLOCKING",
                        model: model
                    }, 'blob')];
                case 1:
                    res = (_a.sent());
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.produceSign = produceSign;
function produceSpeech(eng, model) {
    if (model === void 0) { model = "MALE"; }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runRequest("/produce-speech", {
                        english: eng,
                        request_class: "BLOCKING",
                        model: model
                    }, 'blob')];
                case 1:
                    res = (_a.sent());
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.produceSpeech = produceSpeech;
function runRequest(request, payload, responseType) {
    var _a;
    if (responseType === void 0) { responseType = "json"; }
    return __awaiter(this, void 0, void 0, function () {
        var resp, req_id, _b, _c, _d, resp_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, axios_1.default.post(API_ENDPOINT + request, payload, {
                        headers: {
                            "X-api-key": (0, key_1.getKey)(),
                        },
                        responseType: responseType
                    })];
                case 1:
                    resp = (_e.sent());
                    if (!(resp.status == 202)) return [3 /*break*/, 8];
                    if (!(responseType == undefined)) return [3 /*break*/, 2];
                    _b = resp.data["batch_id"];
                    return [3 /*break*/, 4];
                case 2:
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, ((_a = (resp === null || resp === void 0 ? void 0 : resp.data)) === null || _a === void 0 ? void 0 : _a.text())];
                case 3:
                    _b = _d.apply(_c, [_e.sent()]);
                    _e.label = 4;
                case 4:
                    req_id = _b;
                    _e.label = 5;
                case 5:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, axios_1.default.get(API_ENDPOINT + request + req_id, {
                            headers: {
                                "X-api-key": (0, key_1.getKey)(),
                            },
                            responseType: responseType
                        })];
                case 6:
                    resp_1 = _e.sent();
                    if (resp_1.status == 202) {
                        // job is not done yet, let's poll again
                        return [3 /*break*/, 5];
                    }
                    return [2 /*return*/, resp_1.data];
                case 7: return [3 /*break*/, 9];
                case 8: return [2 /*return*/, resp.data];
                case 9: return [2 /*return*/];
            }
        });
    });
}
