"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKey = exports.setKey = void 0;
var key = null;
function setKey(k) {
    key = k;
}
exports.setKey = setKey;
function getKey() {
    return key;
}
exports.getKey = getKey;
setKey("ROOT");
