"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWebLoginTigoController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CreateWebLoginTigoController = async () => {
    const axios = require('axios');
    const FormData = require('form-data');
    const pathSession = path_1.default.join(__dirname, "..", "..", "cache", "sessionCookie.txt");
    const form_data = new FormData();
    form_data.append('username', process.env.LOGIN_PAINELWEB_USUARIO);
    form_data.append('password', process.env.LOGIN_PAINELWEB_SENHA);
    form_data.append('try_login', 1);
    let res = await axios.post("https://tigotv.xyz/login/", form_data, { headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'multipart/form-data'
        } });
    if ((res === null || res === void 0 ? void 0 : res.status) > 399) {
        return console.log(`Erro ao fazer login no painel web! Erro ${res.data}`);
    }
    let sessionCookie = res.headers['set-cookie'][0].split(';')[0];
    if (fs_1.default.existsSync(pathSession)) {
        fs_1.default.unlinkSync(pathSession);
        fs_1.default.writeFileSync(pathSession, sessionCookie);
    }
    else {
        fs_1.default.writeFileSync(pathSession, sessionCookie);
    }
};
exports.CreateWebLoginTigoController = CreateWebLoginTigoController;
