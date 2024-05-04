"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvaibleLogin = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
const checkAvaibleLogin = async (livePass) => {
    let result = false;
    const idLive = process.env.PROVEDOR_LIVES_ID;
    const provedorAcesso = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idLive);
    const url = `${provedorAcesso.dns}/player_api.php?username=${livePass.username}&password=${livePass.password}`;
    try {
        const axios = require('axios');
        const res = await axios.get(url, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        if ((res === null || res === void 0 ? void 0 : res.status) === 200 && (res === null || res === void 0 ? void 0 : res.data) && !res.data['error']) {
            const max_connections = parseInt(res.data['user_info']['max_connections']);
            const active_cons = parseInt(res.data['user_info']['active_cons']);
            const ativo = res.data['user_info']['status'] === 'Active' ? true : false;
            if (active_cons < max_connections && ativo) {
                result = true;
            }
        }
    }
    catch (error) {
        console.log(`Erro ao consultar servidor DNS-${provedorAcesso.dns} login ${livePass.username} - ${error}`);
    }
    return result;
};
exports.checkAvaibleLogin = checkAvaibleLogin;
