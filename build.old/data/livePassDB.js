"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTrial = exports.deleteLivePass = exports.updateLivePass = exports.zerarLivePass = exports.searchLivePass = exports.unusedUserLivePass = exports.readLivePass = exports.addLivePass = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "live_pass.json");
const addLivePass = (login) => {
    var arquivo = (0, jsonConverte_1.readJSON)(pathJson);
    arquivo.push(login);
    (0, jsonConverte_1.writeJSON)(pathJson, arquivo);
};
exports.addLivePass = addLivePass;
const readLivePass = () => {
    return (0, jsonConverte_1.readJSON)(pathJson);
};
exports.readLivePass = readLivePass;
const unusedUserLivePass = (isRandom) => {
    const users = shuffle((0, exports.readLivePass)());
    let user = users.find(userLive => !userLive.isDelete && userLive.isUsed === false); //&& (new Date(userLive.vencimento) > new Date())
    if (user) {
        return user;
    }
    if (isRandom) {
        user = users.find(userLive => !userLive.isDelete);
    }
    return user;
};
exports.unusedUserLivePass = unusedUserLivePass;
const searchLivePass = (username) => {
    return (0, exports.readLivePass)().find(value => value.username === username);
};
exports.searchLivePass = searchLivePass;
const zerarLivePass = () => {
    const logins = (0, exports.readLivePass)().map(login => {
        return {
            ...login,
            countUsed: 0,
            isUsed: false,
        };
    });
    (0, jsonConverte_1.writeJSON)(pathJson, logins);
    console.log('Lista de logins reiniciado com sucesso.');
};
exports.zerarLivePass = zerarLivePass;
const updateLivePass = (updatedLogin) => {
    const logins = (0, exports.readLivePass)();
    const updatedLogins = logins.map((login) => login.username === updatedLogin.username ? updatedLogin : login);
    (0, jsonConverte_1.writeJSON)(pathJson, updatedLogins);
};
exports.updateLivePass = updateLivePass;
const deleteLivePass = (username) => {
    const logins = (0, exports.readLivePass)();
    const updatedLogins = logins.filter((login) => login.username !== username);
    (0, jsonConverte_1.writeJSON)(pathJson, updatedLogins);
};
exports.deleteLivePass = deleteLivePass;
const processTrial = () => {
    const today = new Date();
    const updatedLogins = (0, exports.readLivePass)().map(login => (login.isTrial && today > new Date(login.vencimento))
        ? { ...login, isDelete: true }
        : login);
    (0, jsonConverte_1.writeJSON)(pathJson, updatedLogins);
};
exports.processTrial = processTrial;
const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
