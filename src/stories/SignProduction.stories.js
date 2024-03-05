"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basic = void 0;
var SignProduction_1 = require("./SignProduction");
var meta = {
    title: 'Base/SignProduction',
    component: SignProduction_1.SignProduction,
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
