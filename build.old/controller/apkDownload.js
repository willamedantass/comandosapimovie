"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apkDownload = void 0;
const path_1 = __importDefault(require("path"));
const apkDownload = async (req, res) => {
    const apk = path_1.default.join(__dirname, "..", "..", "cache", "smarterstvbox.apk");
    res.download(apk);
};
exports.apkDownload = apkDownload;
