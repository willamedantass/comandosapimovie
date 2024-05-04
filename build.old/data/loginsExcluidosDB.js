"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoginsExcluidos = exports.searchLoginsPorUId = exports.searchLoginsExcluidosPorUsername = exports.readLoginsExcluidos = exports.criarLoginsExcluidos = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "logins-excluidos.json");
const criarLoginsExcluidos = (login) => {
    var arquivo = (0, jsonConverte_1.readJSON)(pathJson);
    arquivo.push(login);
    (0, jsonConverte_1.writeJSON)(pathJson, arquivo);
};
exports.criarLoginsExcluidos = criarLoginsExcluidos;
const readLoginsExcluidos = () => {
    return (0, jsonConverte_1.readJSON)(pathJson);
};
exports.readLoginsExcluidos = readLoginsExcluidos;
const searchLoginsExcluidosPorUsername = (username) => {
    return (0, exports.readLoginsExcluidos)().find((value) => value.user === username);
};
exports.searchLoginsExcluidosPorUsername = searchLoginsExcluidosPorUsername;
const searchLoginsPorUId = (uid) => {
    return (0, exports.readLoginsExcluidos)().filter((value) => {
        return value.uid === uid;
    });
};
exports.searchLoginsPorUId = searchLoginsPorUId;
const updateLoginsExcluidos = (login) => {
    const logins = (0, jsonConverte_1.readJSON)(pathJson);
    var loginsNew = [];
    logins.forEach(value => {
        if (value.user === login.user) {
            loginsNew.push(login);
        }
        else {
            loginsNew.push(value);
        }
    });
    (0, jsonConverte_1.writeJSON)(pathJson, loginsNew);
};
exports.updateLoginsExcluidos = updateLoginsExcluidos;
