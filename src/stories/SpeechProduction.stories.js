"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basic = void 0;
var SpeechProduction_1 = require("./SpeechProduction");
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
var meta = {
    title: 'Base/SpeechProduction',
    component: SpeechProduction_1.SpeechProduction,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        modelName: { control: 'text' },
        text: { control: 'text' },
        play: { control: 'bool' },
        onLoaded: { action: 'loaded' },
        onPlaying: { action: 'playing' },
        onStopped: { action: 'stopped' },
    },
};
exports.default = meta;
exports.Basic = {
    args: {
        text: "test"
    },
};
