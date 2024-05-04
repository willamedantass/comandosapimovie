"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = void 0;
const getRandomNumber = () => {
    let min = Math.ceil(10000);
    let max = Math.floor(99999);
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
exports.getRandomNumber = getRandomNumber;
