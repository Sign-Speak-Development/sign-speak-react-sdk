"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyButton = exports.Basic = void 0;
var SpeechRecognition_1 = require("./SpeechRecognition");
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
var meta = {
    title: 'Base/SpeechRecognition',
    component: SpeechRecognition_1.SpeechRecognition,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'This component is responsible for recognizing speech. The only model available is LATEST, but if you are on sole tenancy, there is the option of fine tuning via the API.'
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        buttonClassName: { control: 'text' },
        gotResult: { action: 'processed' },
        transcriptionClassName: { control: 'text' },
        modelName: { control: 'text' }
    },
};
exports.default = meta;
exports.Basic = {
    args: {},
};
exports.OnlyButton = {
    args: {
        transcriptionClassName: "hidden"
    },
};
