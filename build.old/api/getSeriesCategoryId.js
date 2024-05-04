"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesCategoryId = void 0;
const getAxios_1 = require("../util/getAxios");
const path_1 = __importDefault(require("path"));
const jsonConverte_1 = require("../util/jsonConverte");
require('dotenv/config');
const getSeriesCategoryId = async (category_id) => {
    const id = category_id.substring(1);
    const provedor = category_id.charAt(0);
    const idProvedorQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;
    if (provedor === '9') {
        return (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "get_novelas.json"));
    }
    if (category_id === '10') {
        return (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "get_series_popular.json"));
    }
    const res = await (0, getAxios_1.getAxiosResult)('get_series', provedor, id);
    let series = [];
    if (provedor === idProvedorQueNaoModifica) {
        if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
            res.data.forEach(element => {
                element.series_id = provedor + element.series_id;
                element.category_id = provedor + element.category_id;
                series.push(element);
            });
        }
    }
    else {
        forEachSeries(res, series, provedor);
    }
    console.log(`Series Total: ${series.length}`);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return series;
};
exports.getSeriesCategoryId = getSeriesCategoryId;
const forEachSeries = (res, series, provedor) => {
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            element.series_id = provedor + element.series_id;
            element.category_id = provedor;
            series.push(element);
        });
    }
};
