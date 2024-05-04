"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoginAPI = exports.deleteLoginOPainel = exports.createLoginAPI = exports.createLoginOPainel = void 0;
const cacheDB_1 = require("../data/cacheDB");
const logarOPainelController_1 = require("./logarOPainelController");
const toStringDate_1 = require("../util/toStringDate");
const livePassDB_1 = require("../data/livePassDB");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
const axios = require('axios');
const pathPhpSessid = path_1.default.join(__dirname, "..", "..", "cache", "opainel-phpsessid.json");
let isError404 = false;
const createLoginOPainel = async (isLogar) => {
    var _a;
    const action = 'create_login';
    let cache = await (0, cacheDB_1.readAction)(action);
    const dataOld = new Date(cache === null || cache === void 0 ? void 0 : cache.data);
    const dataNow = new Date();
    const countCache = cache.count || 0;
    if (dataOld.getMinutes() === dataNow.getMinutes() && countCache > 5) {
        return { result: false, msg: 'Excesso de logins criado, tente novamente daqui 1 minuto.' };
    }
    console.log(`criaando login.....`);
    const res = await axios_res('Customers', 'createTest');
    if (!isError404 && isLogar && res && (res === null || res === void 0 ? void 0 : res.status) == 200 && typeof (res === null || res === void 0 ? void 0 : res.data) === 'string' && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.includes('Erro na Linha: #0'))) {
        console.log('Fazendo login...');
        isLogar = false;
        await (0, logarOPainelController_1.logarOPainelController)();
        return (0, exports.createLoginOPainel)(false);
    }
    if (!isError404 && res && (res === null || res === void 0 ? void 0 : res.status) === 200 && typeof (res === null || res === void 0 ? void 0 : res.data.ajax) === 'object') {
        const id = res.data.ajax[0].AjaxData.split('=')[3];
        const res_login = await axios_res('Customers', 'modalShow', id);
        if (!isError404 && res_login && (res_login === null || res_login === void 0 ? void 0 : res_login.status) === 200 && typeof (res_login === null || res_login === void 0 ? void 0 : res_login.data.content) === 'object') {
            const login = res_login === null || res_login === void 0 ? void 0 : res_login.data.content['#ModalBody'].split('\r\n').filter(line => line.includes('Usuário') || line.includes('Senha') || line.includes('Data de validade'));
            (0, livePassDB_1.addLivePass)({
                id: id,
                username: login[0].split('*')[2].trim(),
                password: login[1].split('*')[2].trim(),
                vencimento: (0, toStringDate_1.toStringDate)(login[2].split('*')[2].trim()).toISOString(),
                isTrial: true,
                isDelete: false,
                countUsed: 0,
                isUsed: false
            });
            cache = { data: new Date().toISOString(), action: action, count: countCache > 5 ? 0 : countCache + 1 };
            (0, cacheDB_1.createAndUpdateCache)(cache);
            console.log(`Login temporário criado com sucesso. Contador - ${countCache}`);
        }
    }
};
exports.createLoginOPainel = createLoginOPainel;
const createLoginAPI = async () => {
    const res = await axios.post(`${process.env.SERVER_API}/createtest`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS }
    }).catch(e => console.log('Não foi possível conectar com a api.', e === null || e === void 0 ? void 0 : e.message));
    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && (res === null || res === void 0 ? void 0 : res.data.result) === true) {
        const login = res.data.data;
        (0, livePassDB_1.addLivePass)(login);
        console.info(`Login ${login.username}, criado com sucesso.`);
        return true;
    }
    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && (res === null || res === void 0 ? void 0 : res.data.result) === false) {
        console.error(`Erro ao processar os logins. Mensagem da api: ${res === null || res === void 0 ? void 0 : res.data.msg}`);
    }
    return false;
};
exports.createLoginAPI = createLoginAPI;
const deleteLoginOPainel = async (isLogar, id) => {
    var _a, _b;
    const res = await axios_res('Customers', 'delete', id);
    if (!isError404 && isLogar && res && (res === null || res === void 0 ? void 0 : res.status) == 200 && typeof (res === null || res === void 0 ? void 0 : res.data) === 'string' && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.includes('Erro na Linha: #0'))) {
        console.log('Fazendo login...');
        isLogar = false;
        await (0, logarOPainelController_1.logarOPainelController)();
        return (0, exports.deleteLoginOPainel)(false, id);
    }
    if (!isError404 && res && (res === null || res === void 0 ? void 0 : res.status) === 200 && typeof (res === null || res === void 0 ? void 0 : res.data) === 'object') {
        const result = (_b = res.data) === null || _b === void 0 ? void 0 : _b.trigger.includes('Registro deletado com sucesso.');
        if (result) {
            console.log(`Registro ${id} deletado com sucesso.`);
        }
        else {
            console.log(`Não foi possível deletar o registro ${id}.`);
        }
    }
};
exports.deleteLoginOPainel = deleteLoginOPainel;
const deleteLoginAPI = async (id) => {
    const res = await axios.post(`${process.env.SERVER_API}/deletetest?id=${id}`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS }
    }).catch(e => console.log(e));
    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && (res === null || res === void 0 ? void 0 : res.data)) {
        console.log(res.data.msg);
    }
};
exports.deleteLoginAPI = deleteLoginAPI;
const axios_res = async (ajaxfile, ajaxAction, id) => {
    var _a;
    isError404 = false;
    const url_painel = process.env.URL_PAINELWEB_OPAINEL;
    const url = `${url_painel}/src/ajax/Customers.ajax.php`;
    const phpSessid = ((_a = (0, jsonConverte_1.readJSON)(pathPhpSessid)) === null || _a === void 0 ? void 0 : _a.token) || 'PHPSESSID=osfqii9avtprc2khamohugfbsi';
    const FormData = require('form-data');
    const form_data = new FormData();
    form_data.append('AjaxFile', ajaxfile);
    form_data.append('AjaxAction', ajaxAction);
    id ? form_data.append('id', id) : null;
    const res = await axios.post(url, form_data, null, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'Cookie': phpSessid
        }
    }).catch(res => {
        var _a;
        console.log('Erro ao acessar servidor NEWPLAY.');
        isError404 = ((_a = res === null || res === void 0 ? void 0 : res.response) === null || _a === void 0 ? void 0 : _a.status) === 404;
    });
    return res;
};
