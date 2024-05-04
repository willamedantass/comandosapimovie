"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logarKOfficeController = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const deleteLoginKOffice_1 = require("./deleteLoginKOffice");
const pathPhpSessid = path_1.default.join(__dirname, "..", "..", "cache", "koffice-phpsessid.json");
require('dotenv/config');
const logarKOfficeController = async () => {
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    form_data.append('username', process.env.LOGIN_KOFFICE_USUARIO);
    form_data.append('password', process.env.LOGIN_KOFFICE_SENHA);
    form_data.append('try_login', 1);
    const url = `${process.env.URL_PAINELWEB_KOFFICE}/login/`;
    let res = await axios.post(url, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'multipart/form-data'
        }
    });
    if ((res === null || res === void 0 ? void 0 : res.status) > 399) {
        return console.log(`Erro ao fazer login no painel web! Erro ${res.data}`);
    }
    if ((res === null || res === void 0 ? void 0 : res.status) === 200) {
        console.log('Login realizado com sucesso!');
        const sessionCookie = res.headers['set-cookie'][0].split(';')[0];
        (0, jsonConverte_1.writeJSON)(pathPhpSessid, { token: sessionCookie });
    }
    (0, deleteLoginKOffice_1.deleteLoginKOffice)(true);
};
exports.logarKOfficeController = logarKOfficeController;
