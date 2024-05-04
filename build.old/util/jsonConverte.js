"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJSON = exports.mensagem = exports.readObject = exports.readJSON = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readJSON = (pathFileJson) => {
    if (fs_1.default.existsSync(pathFileJson)) {
        let file;
        const fileContents = fs_1.default.readFileSync(pathFileJson, 'utf-8');
        if (fileContents.trim() !== '') {
            file = JSON.parse(fileContents);
        }
        else {
            file = [];
        }
        return file;
    }
    return [];
};
exports.readJSON = readJSON;
const readObject = (pathFileJson) => {
    if (fs_1.default.existsSync(pathFileJson)) {
        let file;
        const fileContents = fs_1.default.readFileSync(pathFileJson, 'utf-8');
        if (fileContents.trim() !== '') {
            file = JSON.parse(fileContents);
        }
        else {
            file = {};
        }
        return file;
    }
    return {};
};
exports.readObject = readObject;
const mensagem = (key, nome) => {
    const pathFileJson = path_1.default.join(__dirname, '..', '..', 'cache', 'mensagens.json');
    const mensagens = JSON.parse(fs_1.default.readFileSync(pathFileJson, 'utf-8'));
    let msg = mensagens[key];
    msg = nome ? msg = msg.replace(/\*\*\*/g, nome) : msg.replace(/\*\*\*/g, '');
    return msg;
};
exports.mensagem = mensagem;
const writeJSON = (pathFileJson, data) => {
    fs_1.default.writeFileSync(pathFileJson, JSON.stringify(data));
};
exports.writeJSON = writeJSON;
