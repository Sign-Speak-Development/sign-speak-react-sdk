"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basic = void 0;
var SpeechProduction_1 = require("./SpeechProduction");
var meta = {
    title: 'Base/SpeechProduction',
    component: SpeechProduction_1.SpeechProduction,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'This component is responsible for producing speech on the provided texts. This component is hidden, and will just play the audio; however, there must have been some kind of webpage interaction before playing due to webbrowsers blocking autoplay. The model can be either MALE or FEMALE (there is a fine tuning API if you are on sole tenancy). NOTE: in the StoryBook UI, don\'t type directly in the text (as each onChange fires off a new render) which will cause you to be rate-limited.'
            },
        },
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
