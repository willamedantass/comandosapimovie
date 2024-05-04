"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndUpdateCache = exports.createCache = exports.readAction = exports.readCache = exports.readOption = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "cache.json");
const readOption = (action) => {
    const option = (0, jsonConverte_1.readJSON)(pathJson).find(value => (value === null || value === void 0 ? void 0 : value.action) === action);
    if (option) {
        return option;
    }
    ;
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let cache = {
        action: '',
        data: date.toISOString()
    };
    return cache;
};
exports.readOption = readOption;
const readCache = (action) => {
    const pathCache = path_1.default.join(__dirname, "..", "..", "cache", `${action}.json`);
    return (0, jsonConverte_1.readJSON)(pathCache);
};
exports.readCache = readCache;
const readAction = (action) => {
    const arquivo = (0, jsonConverte_1.readJSON)(pathJson);
    const result = arquivo.find(value => (value === null || value === void 0 ? void 0 : value.action) === action);
    if (!result) {
        return { action: action, data: new Date().toISOString(), count: 0 };
    }
    return result;
};
exports.readAction = readAction;
const createCache = (action, data) => {
    const pathCache = path_1.default.join(__dirname, "..", "..", "cache", `${action}.json`);
    (0, jsonConverte_1.writeJSON)(pathCache, data);
};
exports.createCache = createCache;
const createAndUpdateCache = (cache) => {
    const arquivo = (0, jsonConverte_1.readJSON)(pathJson);
    const action = arquivo.find(value => (value === null || value === void 0 ? void 0 : value.action) === cache.action);
    if (arquivo.length && action) {
        const arquivoNew = arquivo.map((value) => {
            if ((value === null || value === void 0 ? void 0 : value.action) === cache.action) {
                return cache;
            }
            else {
                return value;
            }
        });
        (0, jsonConverte_1.writeJSON)(pathJson, arquivoNew);
    }
    else {
        arquivo.push(cache);
        (0, jsonConverte_1.writeJSON)(pathJson, arquivo);
    }
};
exports.createAndUpdateCache = createAndUpdateCache;
