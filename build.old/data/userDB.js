"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.saveAllUser = exports.allUser = exports.searchUserLogins = exports.searchUser = exports.preCreateUser = exports.createUser = void 0;
const userFirestore_1 = require("./userFirestore");
const jsonConverte_1 = require("../util/jsonConverte");
const loginDB_1 = require("./loginDB");
const path_1 = __importDefault(require("path"));
const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "user.json");
const createUser = async (user) => {
    try {
        const userNew = await (0, userFirestore_1.FirestoreUserCreate)(user);
        (0, exports.updateUser)(userNew);
        return userNew.id;
    }
    catch (error) {
        console.error(`Erro ao criar usuário. ${error}`);
    }
};
exports.createUser = createUser;
const preCreateUser = (user) => {
    try {
        const users = (0, exports.allUser)();
        users.push(user);
        (0, exports.saveAllUser)(users);
    }
    catch (error) {
        console.error(`Erro ao criar usuário. ${error}`);
    }
};
exports.preCreateUser = preCreateUser;
const searchUser = (remoteJid) => {
    return (0, exports.allUser)().find(value => value.remoteJid === remoteJid);
};
exports.searchUser = searchUser;
const searchUserLogins = (remoteJid) => {
    const user = (0, exports.allUser)().find(value => value.remoteJid === remoteJid);
    if (user) {
        return (0, loginDB_1.searchLoginsPorUId)(user.id);
    }
    return [];
};
exports.searchUserLogins = searchUserLogins;
const allUser = () => {
    return (0, jsonConverte_1.readJSON)(pathJson);
};
exports.allUser = allUser;
const saveAllUser = (users) => {
    (0, jsonConverte_1.writeJSON)(pathJson, users);
};
exports.saveAllUser = saveAllUser;
const updateUser = async (user) => {
    try {
        const usersNew = (0, exports.allUser)().map(usr => {
            if (usr.remoteJid === user.remoteJid) {
                return user;
            }
            return usr;
        });
        //await FirestoreUserUpdate(user);
        (0, exports.saveAllUser)(usersNew);
    }
    catch (error) {
        console.error(`Erro ao atualizar usuário. ${error}`);
    }
};
exports.updateUser = updateUser;
