"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginWebKOfficeController = void 0;
const cacheDB_1 = require("../data/cacheDB");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const logarKOfficeController_1 = require("./logarKOfficeController");
require('dotenv/config');
const pathPhpSessid = path_1.default.join(__dirname, "..", "..", "cache", "koffice-phpsessid.json");
const createLoginWebKOfficeController = async (isLogar) => {
    var _a, _b;
    const action = 'create_login';
    const url_server = process.env.URL_PAINELWEB_KOFFICE;
    let cache = await (0, cacheDB_1.readAction)(action);
    const dataOld = new Date(cache === null || cache === void 0 ? void 0 : cache.data);
    const dataNow = new Date();
    const countCache = cache.count || 0;
    if (dataOld.getMinutes() === dataNow.getMinutes() && countCache > 4) {
        return { result: false, msg: 'Excesso de logins criado, tente novamente daqui 1 minuto.' };
    }
    let isError404 = false;
    const phpSessid = ((_a = (0, jsonConverte_1.readJSON)(pathPhpSessid)) === null || _a === void 0 ? void 0 : _a.token) || 'PHPSESSID=osfqii9avtprc2khamohugfbsi';
    const axios = require('axios');
    const url = `${url_server}/dashboard/api/?fast_test`;
    const res = await axios.post(url, null, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'origin': url_server,
            'referer': `${url_server}/clients/`,
            'x-requested-with': 'XMLHttpRequest',
            'Cookie': phpSessid
        }
    }).catch(res => {
        var _a;
        isError404 = ((_a = res === null || res === void 0 ? void 0 : res.response) === null || _a === void 0 ? void 0 : _a.status) === 404;
    });
    if (!isError404 && isLogar && res && (res === null || res === void 0 ? void 0 : res.status) == 200 && typeof (res === null || res === void 0 ? void 0 : res.data) === 'string' && ((_b = res.data) === null || _b === void 0 ? void 0 : _b.includes(`${process.env.URL_PAINELWEB_KOFFICE}/login/`))) {
        console.log('Fazendo login...');
        isLogar = false;
        await (0, logarKOfficeController_1.logarKOfficeController)();
        return (0, exports.createLoginWebKOfficeController)(false);
    }
    if (!isError404 && res && (res === null || res === void 0 ? void 0 : res.status) === 200 && typeof (res === null || res === void 0 ? void 0 : res.data) === 'object') {
        cache = { data: new Date().toISOString(), action: action, count: countCache > 4 ? 0 : countCache + 1 };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        const login = res.data.message.split('<br />').filter(line => line.includes('Usuário') || line.includes('Senha'));
        const username = login[0].split(':')[1].trim();
        const password = login[1].split(':')[1].trim();
        return { result: true, msg: 'Login criado com sucesso!', user: username, pass: password };
    }
    return { result: false, msg: 'Erro ao gerar login!' };
};
exports.createLoginWebKOfficeController = createLoginWebKOfficeController;
