"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoginAPI = exports.CreateLoginApi = void 0;
const livePassDB_1 = require("../data/livePassDB");
require('dotenv/config');
const CreateLoginApi = async () => {
    const axios = require('axios');
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
exports.CreateLoginApi = CreateLoginApi;
const deleteLoginAPI = async (id) => {
    const axios = require('axios');
    const res = await axios.post(`${process.env.SERVER_API}/deletetest?id=${id}`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS }
    }).catch(e => console.log(e));
    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && (res === null || res === void 0 ? void 0 : res.data)) {
        console.log(res.data.msg);
    }
};
exports.deleteLoginAPI = deleteLoginAPI;
