"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SpeechRecognition = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var adapter_1 = require("../network/adapter");
var tailwind_merge_1 = require("tailwind-merge");
var react_spinners_1 = require("react-spinners");
var SpeechRecognition = function (_a) {
    var _b = _a.modelName, modelName = _b === void 0 ? "LATEST" : _b, _c = _a.containerClassName, containerClassName = _c === void 0 ? "" : _c, _d = _a.buttonClassName, buttonClassName = _d === void 0 ? "" : _d, _e = _a.transcriptionClassName, transcriptionClassName = _e === void 0 ? "" : _e, _f = _a.loadingClassName, loadingClassName = _f === void 0 ? "" : _f, _g = _a.gotResult, gotResult = _g === void 0 ? function (_) { } : _g, props = __rest(_a, ["modelName", "containerClassName", "buttonClassName", "transcriptionClassName", "loadingClassName", "gotResult"]);
    var stream = (0, react_1.useRef)(null);
    var recorder = (0, react_1.useRef)(null);
    var _h = (0, react_1.useState)(null), transcription = _h[0], setTranscription = _h[1];
    var _j = (0, react_1.useState)(false), processing = _j[0], setProcessing = _j[1];
    var _k = (0, react_1.useState)(false), recording = _k[0], setRecording = _k[1];
    var startRecording = function () {
        if (stream.current == null) {
            return;
        }
        recorder.current = new MediaRecorder(stream.current);
        setRecording(true);
        recorder.current.start();
        recorder.current.ondataavailable = function (e) {
            var blob = new Blob([e.data], { type: "audio/mp3" });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                setProcessing(true);
                (0, adapter_1.recognizeSpeech)(reader.result.split(",")[1]).then(function (v) {
                    setProcessing(false);
                    setTranscription(v);
                    gotResult(v);
                });
            };
        };
        recorder.current.onstop = function (_) {
            setRecording(false);
        };
    };
    var stopRecording = function () {
        if (recorder.current == null) {
            return null;
        }
        if (recorder.current.state === "recording") {
            recorder.current.stop();
        }
    };
    var initRecording = function () {
        if (stream.current) {
            var tracks = stream.current.getTracks();
            tracks.forEach(function (track) { return track.stop(); });
        }
        navigator.mediaDevices
            .getUserMedia({
            video: false,
            audio: true,
        })
            .then(function (new_stream) {
            stream.current = new_stream;
        });
    };
    (0, react_1.useEffect)(function () {
        initRecording();
        return function () {
            if (stream.current) {
                var tracks = stream.current.getTracks();
                tracks.forEach(function (track) { return track.stop(); });
            }
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, tailwind_merge_1.twMerge)("flex flex-col ".concat(containerClassName)) }, { children: [transcription != null && transcription.trim().length > 0 ? (0, jsx_runtime_1.jsx)("p", __assign({ className: (0, tailwind_merge_1.twMerge)("mt-2 p-3 mx-auto ".concat(transcriptionClassName)) }, { children: transcription })) : null, processing ?
                (0, jsx_runtime_1.jsx)(react_spinners_1.ScaleLoader, { color: '#00AA9D', className: (0, tailwind_merge_1.twMerge)("mt-2 p-3 mx-auto ".concat(loadingClassName)) }) :
                recording ? ((0, jsx_runtime_1.jsx)("button", __assign({ className: (0, tailwind_merge_1.twMerge)("mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(buttonClassName)), onClick: stopRecording }, { children: "Stop Listening" }))) : ((0, jsx_runtime_1.jsx)("button", __assign({ className: (0, tailwind_merge_1.twMerge)("mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(buttonClassName)), onClick: startRecording }, { children: "Start Listening" })))] })));
};
exports.SpeechRecognition = SpeechRecognition;
