"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesCategories = void 0;
const cacheDB_1 = require("../data/cacheDB");
const jsonConverte_1 = require("../util/jsonConverte");
const getAxios_1 = require("../util/getAxios");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
const getSeriesCategories = async () => {
    const action = 'get_series_categories';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        const logins = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        let categorias = [];
        categorias.push({ "category_id": "9", "category_name": "NOVELAS", "parent_id": 0 });
        categorias.push({ "category_id": "10", "category_name": "TOP SERIES", "parent_id": 0 });
        let category_novelas = [];
        for (const login of logins) {
            let res = await (0, getAxios_1.getAxiosResult)(action, login.id);
            forEachCategories(res, categorias, category_novelas, login.id);
            categorias.push({ "category_id": login.id, "category_name": `${login.sigla}SERIES`, "parent_id": 0 });
        }
        (0, jsonConverte_1.writeJSON)(path_1.default.join(__dirname, "..", "..", "cache", "categories_novelas.json"), category_novelas);
        const cache = {
            data: new Date().toISOString(),
            action: action,
        };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        (0, cacheDB_1.createCache)(action, categorias);
        return categorias;
    }
    else {
        return (0, cacheDB_1.readCache)(action);
    }
};
exports.getSeriesCategories = getSeriesCategories;
const forEachCategories = (res, categorias, category_novelas, provedor) => {
    const idProvedoQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
        res === null || res === void 0 ? void 0 : res.data.forEach(element => {
            const name = element.category_name.toLowerCase();
            if (name.includes("novela") || name.includes("novelas")) {
                category_novelas.push(provedor + element.category_id);
            }
            if (idProvedoQueNaoModifica == provedor) {
                element.category_id = provedor + element.category_id;
                categorias.push(element);
            }
        });
    }
};
