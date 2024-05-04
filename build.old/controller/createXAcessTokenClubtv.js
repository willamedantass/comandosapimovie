"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createXAcessTokenClubtv = void 0;
const path_1 = __importDefault(require("path"));
const jsonConverte_1 = require("../util/jsonConverte");
const sleep_1 = __importDefault(require("../util/sleep"));
const createCacheLoginsClubtv_1 = require("./createCacheLoginsClubtv");
const deletarLoginsExpiradosClubtv_1 = require("./deletarLoginsExpiradosClubtv");
const createXAcessTokenClubtv = async () => {
    const pathSessionClub = path_1.default.join(__dirname, "..", "..", "cache", "session_club.json");
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const url_club_api = process.env.URL_CLUBTV_API;
    const username = process.env.LOGIN_CLUBTV_PAINELWEB_USUARIO;
    const password = process.env.LOGIN_CLUBTV_PAINELWEB_SENHA;
    const chave_api = process.env.CHAVE_ANTICAPCHA_API;
    const dataSiteKeyCapcha = process.env.DATA_SITEKEY_RECAPCHA;
    let token_recapcha;
    //Anti Capcha
    const ac = require("@antiadmin/anticaptchaofficial");
    ac.setAPIKey(chave_api);
    ac.setSoftId(0);
    await ac.solveRecaptchaV2Proxyless(url_club_api, dataSiteKeyCapcha)
        .then(gresponse => {
        token_recapcha = gresponse;
        console.log(gresponse);
    })
        .catch(error => console.log('Não conseguiu resolver o captcha, erro:' + error));
    form_data.append('username', username);
    form_data.append('password', password);
    form_data.append('g-recaptcha-response', token_recapcha);
    await (0, sleep_1.default)(3000);
    await axios.post(`${url_club_api}/login`, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
        }
    }).then((res) => {
        var _a;
        if ((_a = res.data) === null || _a === void 0 ? void 0 : _a.result) {
            (0, jsonConverte_1.writeJSON)(pathSessionClub, { token: res.data.token });
        }
    }).catch((res) => {
        console.log('Não foi possível fazer login. Mensagem de erro:', res === null || res === void 0 ? void 0 : res.response.data.msg);
    });
    (0, createCacheLoginsClubtv_1.createCacheLoginsClubtv)();
    (0, deletarLoginsExpiradosClubtv_1.deletarLoginsExpirados)();
};
exports.createXAcessTokenClubtv = createXAcessTokenClubtv;
