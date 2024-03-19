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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignRecognition = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var adapter_1 = require("../network/adapter");
var ClipLoader_1 = __importDefault(require("react-spinners/ClipLoader"));
var tailwind_merge_1 = require("tailwind-merge");
var SpeechProduction_1 = require("./SpeechProduction");
var State;
(function (State) {
    State[State["WAITING"] = 0] = "WAITING";
    State[State["RECORDING"] = 1] = "RECORDING";
    State[State["PROCESSING"] = 2] = "PROCESSING";
    State[State["RATING"] = 3] = "RATING";
    State[State["CORRECTING"] = 4] = "CORRECTING";
})(State || (State = {}));
var SignRecognition = function (_a) {
    var _b = _a.modelName, modelName = _b === void 0 ? "LATEST" : _b, _c = _a.containerClassName, containerClassName = _c === void 0 ? "" : _c, _d = _a.cameraClassName, cameraClassName = _d === void 0 ? "" : _d, _e = _a.buttonClassName, buttonClassName = _e === void 0 ? "" : _e, _f = _a.interpretationClassName, interpretationClassName = _f === void 0 ? "" : _f, _g = _a.includeFeedback, includeFeedback = _g === void 0 ? true : _g, _h = _a.gotResult, gotResult = _h === void 0 ? function (_) { } : _h, props = __rest(_a, ["modelName", "containerClassName", "cameraClassName", "buttonClassName", "interpretationClassName", "includeFeedback", "gotResult"]);
    var preview = (0, react_1.useRef)(null);
    var stream = (0, react_1.useRef)(null);
    var recorder = (0, react_1.useRef)(null);
    var _j = (0, react_1.useState)(null), interpretation = _j[0], setInterpretation = _j[1];
    var _k = (0, react_1.useState)(State.WAITING), state = _k[0], setState = _k[1];
    var _l = (0, react_1.useState)(null), correction = _l[0], setCorrection = _l[1];
    var _m = (0, react_1.useState)(null), feedbackID = _m[0], setFeedbackID = _m[1];
    var startRecording = function () {
        if (stream.current == null) {
            return;
        }
        recorder.current = new MediaRecorder(stream.current);
        setState(State.RECORDING);
        recorder.current.start();
        recorder.current.ondataavailable = function (e) {
            var blob = new Blob([e.data], { type: "video/mp4" });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                setState(State.PROCESSING);
                (0, adapter_1.recognizeSign)(reader.result.split(",")[1], modelName).then(function (_a) {
                    var v = _a[0], fb = _a[1];
                    setFeedbackID(fb);
                    setState(State.RATING);
                    setInterpretation(v);
                    gotResult(v);
                });
            };
        };
        recorder.current.onstop = function (_) {
            setState(State.WAITING);
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
            video: true,
            audio: false,
        })
            .then(function (new_stream) {
            stream.current = new_stream;
            if (preview.current != null) {
                preview.current.srcObject = new_stream;
            }
        });
    };
    var submitCorrection = function () {
        if (feedbackID == null) {
            setState(State.WAITING);
            return;
        }
        setInterpretation(correction);
        (0, adapter_1.submitFeedback)(feedbackID, null, correction);
        setFeedbackID(null);
        setCorrection(null);
        setState(State.WAITING);
    };
    var submitGood = function (good) {
        if (good == null || feedbackID == null) {
            setState(State.WAITING);
            return;
        }
        (0, adapter_1.submitFeedback)(feedbackID, good, null);
        if (good) {
            setState(State.WAITING);
        }
        else {
            setState(State.CORRECTING);
        }
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
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, tailwind_merge_1.twMerge)("flex flex-col ".concat(containerClassName)) }, { children: [interpretation ? (0, jsx_runtime_1.jsx)(SpeechProduction_1.SpeechProduction, { text: interpretation }) : null, (0, jsx_runtime_1.jsx)("video", { autoPlay: true, playsInline: true, muted: true, ref: preview, className: (0, tailwind_merge_1.twMerge)("max-w-[25vw] mx-auto ".concat(cameraClassName)) }), interpretation != null && interpretation.trim().length > 0 ? (0, jsx_runtime_1.jsx)("p", __assign({ className: (0, tailwind_merge_1.twMerge)("mt-2 p-3 mx-auto ".concat(interpretationClassName)) }, { children: interpretation })) : null, state == State.PROCESSING ?
                (0, jsx_runtime_1.jsx)(ClipLoader_1.default, { color: '#00AA9D', className: (0, tailwind_merge_1.twMerge)("mt-2 p-3 mx-auto ".concat(containerClassName)) })
                : state == State.RECORDING ?
                    (0, jsx_runtime_1.jsx)("button", __assign({ className: "mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(containerClassName), onClick: stopRecording }, { children: "Stop Recording" }))
                    : state == State.WAITING ?
                        (0, jsx_runtime_1.jsx)("button", __assign({ className: "mt-2 p-3 mx-auto bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(containerClassName), onClick: startRecording }, { children: "Start Recording" }))
                        : state == State.CORRECTING ?
                            (0, jsx_runtime_1.jsx)("input", { className: "mt-2 p-3 rounded-sm border-sign-speak-teal border", onSubmit: submitCorrection, onKeyUp: function (e) { return e.key == "Enter" ? submitCorrection() : null; }, onChange: function (e) { return setCorrection(e.target.value); }, defaultValue: interpretation !== null && interpretation !== void 0 ? interpretation : "" })
                            :
                                (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex flex-row justify-center" }, { children: [(0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () { return submitGood(true); }, className: "mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(containerClassName) }, { children: "Good" })), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () { return submitGood(false); }, className: "mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(containerClassName) }, { children: "Bad" })), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () { return submitGood(null); }, className: "mt-2 p-3 mx-2 bg-sign-speak-teal rounded-lg font-semibold text-white ".concat(containerClassName) }, { children: "Skip" }))] }))] })));
};
exports.SignRecognition = SignRecognition;
