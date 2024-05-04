"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cacheDB_1 = require("../data/cacheDB");
const getRandomString_1 = require("../util/getRandomString");
const jsonConverte_1 = require("../util/jsonConverte");
const sleep_1 = __importDefault(require("../util/sleep"));
const path_1 = __importDefault(require("path"));
const stringClean_1 = require("../util/stringClean");
const names_1 = require("../util/names");
const createXAcessTokenClubtv_1 = require("./createXAcessTokenClubtv");
require('dotenv/config');
const createWebLoginClub = async (isLogar) => {
    var _a;
    const pathSessionClub = path_1.default.join(__dirname, "..", "..", "cache", "session_club.json");
    const action = 'create_login_club';
    let cache = await (0, cacheDB_1.readAction)(action);
    const dataOld = new Date(cache.data);
    const dataNow = new Date();
    const count = cache.count || 0;
    if (dataOld.getMinutes() === dataNow.getMinutes() && count > 4) {
        return { result: false, msg: 'Excesso de logins criado, tente novamente daqui 1 minuto.' };
    }
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const urlClubApi = process.env.URL_CLUBTV_API;
    const x_access_token = ((_a = (0, jsonConverte_1.readJSON)(pathSessionClub)) === null || _a === void 0 ? void 0 : _a.token) || '000000000';
    const url = `${urlClubApi}/listas/teste`;
    const username = (0, stringClean_1.StringClean)(names_1.Names[Math.floor(Math.random() * names_1.Names.length)]) + 'mwsn';
    const password = ((0, getRandomString_1.getRandomString)() + '5');
    let response = { result: false, msg: '' };
    form_data.append('adulto', 35);
    form_data.append('horas', 6);
    form_data.append('username', username);
    form_data.append('nitro', 0);
    form_data.append('password', password);
    await axios.post(url, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x_access_token': x_access_token
        }
    }).then((res) => {
        var _a, _b;
        console.log(`Clubtv Login: ${username}-${(_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.msg}`);
        if ((_b = res.data) === null || _b === void 0 ? void 0 : _b.result) {
            cache = { data: new Date().toISOString(), action: action, count: count > 4 ? 0 : count + 1 };
            (0, cacheDB_1.createAndUpdateCache)(cache);
            response = { result: true, msg: 'Login criado com sucesso!', data: { user: username, pass: password } };
        }
    }).catch(async (res) => {
        response = { result: false, msg: res === null || res === void 0 ? void 0 : res.response.data };
        if ((res === null || res === void 0 ? void 0 : res.response.status) > 499) {
            isLogar = false;
        }
    });
    if (isLogar && !response.result) {
        console.log(`Fazendo login... Islogar:${isLogar} Response:${response}`);
        isLogar = false;
        await (0, createXAcessTokenClubtv_1.createXAcessTokenClubtv)();
        await (0, sleep_1.default)(3000);
        await createWebLoginClub(isLogar);
    }
    return response;
};
exports.default = createWebLoginClub;
