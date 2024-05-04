"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheLoginsClubtv = void 0;
const path_1 = __importDefault(require("path"));
const jsonConverte_1 = require("../util/jsonConverte");
const cacheDB_1 = require("../data/cacheDB");
require('dotenv/config');
const createCacheLoginsClubtv = async () => {
    var _a;
    const action = 'club_logins_ativos';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        const axios = require('axios');
        const urlClubApi = process.env.URL_CLUBTV_API;
        const pathSessionClub = path_1.default.join(__dirname, "..", "..", "cache", "session_club.json");
        const x_access_token = ((_a = (0, jsonConverte_1.readJSON)(pathSessionClub)) === null || _a === void 0 ? void 0 : _a.token) || '000000000';
        const url = `${urlClubApi}/listas/minhas`;
        let data = [];
        const logins = [];
        await axios.post(url, null, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x_access_token': x_access_token
            }
        }).then((res) => {
            data = res === null || res === void 0 ? void 0 : res.data.data;
        }).catch(async (res) => {
            console.log(`Erro no processo de criação do cache de logins do clubtv: ${res}`);
        });
        for (let login of data) {
            const url_info = `${urlClubApi}/listas/${login.id}/info`;
            await axios.get(url_info, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x_access_token': x_access_token
                }
            }).then((res) => {
                if (res === null || res === void 0 ? void 0 : res.data.result) {
                    logins.push({ user: res.data.data.username, password: res.data.data.password });
                }
            }).catch(async (res) => {
                console.log(`Erro no processo de criação do cache de logins do clubtv: ${res}`);
            });
        }
        const cache = {
            data: new Date().toISOString(),
            action: action,
        };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        (0, cacheDB_1.createCache)(action, logins);
        console.log('Sucesso na criação da listagem de logins do clubtv!');
    }
};
exports.createCacheLoginsClubtv = createCacheLoginsClubtv;
