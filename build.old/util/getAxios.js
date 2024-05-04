"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxiosResult = void 0;
const jsonConverte_1 = require("./jsonConverte");
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const getAxiosResult = async (action, provedor, id, limit) => {
    const login = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === provedor);
    if ((login === null || login === void 0 ? void 0 : login.dns) === '') {
        console.error('Paramentro DNS vázio, não poderar executar o getAxios!');
        return { status: 401, data: [] };
    }
    try {
        let res;
        if (login) {
            if (action === "get_vod_streams") {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}&action=${action}${id ? `&category_id=${id}` : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
            else if (action === "get_vod_info") {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}&action=${action}&vod_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
            else if (action === "get_series") {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}&action=${action}${id ? `&category_id=${id}` : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
            else if (action === "get_series_info") {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}&action=${action}&series_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
            else if (action === "get_live_streams") {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}&action=${action}${id ? ('&category_id=' + id) : ''}`, { headers: { 'accept-encoding': 'gzip', 'User-Agent': 'IPTVSmartersPlayer', 'content-type': 'application/x-www-form-urlencoded' } });
            }
            else if (action === "get_short_epg") {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}&action=${action}&stream_id=${id}&limit=${limit}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
            else {
                res = await (0, axios_1.default)(`${login === null || login === void 0 ? void 0 : login.dns}/player_api.php?username=${login === null || login === void 0 ? void 0 : login.user}&password=${login === null || login === void 0 ? void 0 : login.password}${action ? '&action=' + action : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
        }
        return res;
    }
    catch (error) {
        console.log(`Erro ao carregar servidor ${login === null || login === void 0 ? void 0 : login.dns}. Login: ${login === null || login === void 0 ? void 0 : login.user} - Erro: ${error}`);
    }
    return null;
};
exports.getAxiosResult = getAxiosResult;
