"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechProduction = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var adapter_1 = require("../network/adapter");
var SpeechProduction = function (_a) {
    var _b = _a.modelName, modelName = _b === void 0 ? "MALE" : _b, text = _a.text, _c = _a.play, play = _c === void 0 ? true : _c, _d = _a.onLoaded, onLoaded = _d === void 0 ? function () { } : _d, _e = _a.onPlaying, onPlaying = _e === void 0 ? function () { } : _e, _f = _a.onStopped, onStopped = _f === void 0 ? function () { } : _f, props = __rest(_a, ["modelName", "text", "play", "onLoaded", "onPlaying", "onStopped"]);
    var _g = (0, react_1.useState)(null), audio = _g[0], setAudio = _g[1];
    (0, react_1.useEffect)(function () {
        (0, adapter_1.produceSpeech)(text, modelName).then(function (x) {
            setAudio(x);
            onLoaded();
        });
    }, [text]);
    (0, react_1.useEffect)(function () {
        if (play && audio != null) {
            onPlaying();
            var audioUrl_1 = URL.createObjectURL(audio);
            var audioElement = new Audio();
            audioElement.src = audioUrl_1;
            audioElement.play();
            audioElement.onended = function () {
                URL.revokeObjectURL(audioUrl_1);
                onStopped();
            };
        }
    }, [audio, play]);
    return (0, jsx_runtime_1.jsx)("div", {});
};
exports.SpeechProduction = SpeechProduction;
