"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basic = void 0;
var SignProduction_1 = require("./SignProduction");
var meta = {
    title: 'Base/SignProduction',
    component: SignProduction_1.SignProduction,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'This component is responsible for producing sign language avatar based on the provided texts. The model can be either MALE or FEMALE (there is a fine tuning API if you are on sole tenancy). NOTE: in the StoryBook UI, don\'t type directly in the text (as each onChange fires off a new render) which will cause you to be rate-limited.'
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
