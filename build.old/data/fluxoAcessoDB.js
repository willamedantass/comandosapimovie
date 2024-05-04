"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUserFluxo = exports.updateUserFluxo = exports.zerarUserFluxo = exports.searchUserFluxo = exports.readUserFluxo = exports.createUserFluxo = void 0;
const livePassDB_1 = require("../data/livePassDB");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "fluxo_acesso.json");
const dateExpire = () => {
    const dataExpirar = new Date();
    dataExpirar.setMinutes(dataExpirar.getMinutes() + 30);
    return dataExpirar.toISOString();
};
const isExpired = (expireDate) => {
    const today = new Date();
    const expireDateObj = new Date(expireDate);
    return today > expireDateObj;
};
const updateStatusUserFluxo = (userFluxo) => {
    const userLivepass = (0, livePassDB_1.searchLivePass)(userFluxo.login);
    if (userLivepass) {
        if (userLivepass.countUsed > 0) {
            userLivepass.countUsed -= 1;
        }
        userLivepass.isUsed = userLivepass.countUsed !== 0;
        (0, livePassDB_1.updateLivePass)(userLivepass);
    }
};
const createUserFluxo = (user, livePass) => {
    const { username, password } = livePass;
    const users = (0, exports.readUserFluxo)();
    const existingLivePass = (0, livePassDB_1.searchLivePass)(username);
    if (existingLivePass) {
        existingLivePass.isUsed = true;
        existingLivePass.countUsed += 1;
        (0, livePassDB_1.updateLivePass)(existingLivePass);
        const newUserFluxo = {
            user,
            login: username,
            password,
            expire: dateExpire(),
            data: new Date().toISOString()
        };
        users.push(newUserFluxo);
        (0, jsonConverte_1.writeJSON)(pathJson, users);
    }
};
exports.createUserFluxo = createUserFluxo;
const readUserFluxo = () => {
    return (0, jsonConverte_1.readJSON)(pathJson) || [];
};
exports.readUserFluxo = readUserFluxo;
const searchUserFluxo = (user) => {
    return (0, exports.readUserFluxo)().find(value => value.user === user);
};
exports.searchUserFluxo = searchUserFluxo;
const zerarUserFluxo = () => {
    (0, jsonConverte_1.writeJSON)(pathJson, []);
    console.log('Lista de fluxo de acesso zerado com sucesso.');
};
exports.zerarUserFluxo = zerarUserFluxo;
const updateUserFluxo = async (userFluxo) => {
    const users = (0, exports.readUserFluxo)();
    const updatedUsers = users.map(value => value.user === userFluxo.user ? { ...userFluxo, expire: dateExpire(), data: new Date().toISOString() } : value);
    (0, jsonConverte_1.writeJSON)(pathJson, updatedUsers);
};
exports.updateUserFluxo = updateUserFluxo;
const processUserFluxo = () => {
    const usersFluxo = [];
    (0, exports.readUserFluxo)().forEach((userFluxo) => {
        if (isExpired(userFluxo.expire)) {
            updateStatusUserFluxo(userFluxo);
        }
        else {
            usersFluxo.push(userFluxo);
        }
    });
    (0, jsonConverte_1.writeJSON)(pathJson, usersFluxo);
    (0, livePassDB_1.processTrial)();
};
exports.processUserFluxo = processUserFluxo;
