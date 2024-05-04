"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmsCategoryId = void 0;
const getAxios_1 = require("../util/getAxios");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const getFilmsCategoryId = async (category_id) => {
    const id = category_id.substring(1);
    const provedor = category_id.charAt(0);
    if (category_id === '999989') {
        return (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "get_vod_popular.json"));
    }
    if (category_id === '999999') {
        return (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "get_vods_adult.json"));
    }
    const res = await (0, getAxios_1.getAxiosResult)('get_vod_streams', provedor, id);
    let filmsJson = [];
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            element.stream_id = provedor + element.stream_id;
            element.category_id = provedor + element.category_id;
            filmsJson.push(element);
        });
    }
    console.log(`Filmes Total: ${filmsJson.length}`);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return filmsJson;
};
exports.getFilmsCategoryId = getFilmsCategoryId;
