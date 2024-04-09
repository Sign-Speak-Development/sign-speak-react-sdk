"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyButton = exports.Basic = void 0;
var SignRecognition_1 = require("./SignRecognition");
var meta = {
    title: 'Base/SignLanguageRecognition',
    component: SignRecognition_1.SignRecognition,
    parameters: {
        layout: 'centered',
        description: {
            component: 'This component is responsible for recognizing sign language and outputting english. If you\'ve not been instructed otherwise, the only model available to you is LATEST'
        },
    },
    tags: ['autodocs'],
    argTypes: {
        buttonClassName: { control: 'text' },
        cameraClassName: { control: 'text' },
        gotResult: { action: 'processed' },
        interpretationClassName: { control: 'text' },
        modelName: { control: 'text' },
        includeFeedback: { control: 'boolean' }
    },
};
exports.default = meta;
exports.Basic = {
    args: {},
};
exports.OnlyButton = {
    args: {
        cameraClassName: "hidden",
        interpretationClassName: "hidden"
    },
};
