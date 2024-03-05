"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyButton = exports.Basic = void 0;
var SignRecognition_1 = require("./SignRecognition");
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
var meta = {
    title: 'Base/SignLanguageRecognition',
    component: SignRecognition_1.SignRecognition,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        buttonClassName: { control: 'text' },
        cameraClassName: { control: 'text' },
        gotResult: { action: 'processed' },
        interpretationClassName: { control: 'text' },
        modelName: { control: 'text' }
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
