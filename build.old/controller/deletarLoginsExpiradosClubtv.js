"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarLoginsExpirados = void 0;
const createXAcessTokenClubtv_1 = require("./createXAcessTokenClubtv");
const jsonConverte_1 = require("../util/jsonConverte");
const sleep_1 = __importDefault(require("../util/sleep"));
const path_1 = __importDefault(require("path"));
require('dotenv/config');
let isLogar = true;
const deletarLoginsExpirados = async () => {
    var _a;
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const urlClubApi = process.env.URL_CLUBTV_API;
    const pathSessionClub = path_1.default.join(__dirname, "..", "..", "cache", "session_club.json");
    const x_access_token = ((_a = (0, jsonConverte_1.readJSON)(pathSessionClub)) === null || _a === void 0 ? void 0 : _a.token) || '000000000';
    const url = `${urlClubApi}/listas/deletar_expiradas`;
    form_data.append('testes', 1);
    form_data.append('tipo', 'minhas');
    await axios.post(url, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x_access_token': x_access_token
        }
    }).then((res) => {
        var _a;
        if ((_a = res.data) === null || _a === void 0 ? void 0 : _a.result) {
            console.log('Sucesso no processo de exclusão de logins expirados.');
            isLogar = false;
        }
    }).catch(async (res) => {
        console.log(`Erro no processo de exclusão dos logins expirados: ${res}`);
        if ((res === null || res === void 0 ? void 0 : res.response.status) > 499) {
            isLogar = false;
        }
    });
    if (isLogar) {
        console.log(`Fazendo login no portal do clubtv...`);
        isLogar = false;
        await (0, createXAcessTokenClubtv_1.createXAcessTokenClubtv)();
        await (0, sleep_1.default)(3000);
    }
};
exports.deletarLoginsExpirados = deletarLoginsExpirados;
