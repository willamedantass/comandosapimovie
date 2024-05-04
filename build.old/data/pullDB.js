"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullDb = void 0;
const loginDB_1 = require("./loginDB");
const loginsFirestore_1 = require("./loginsFirestore");
const userDB_1 = require("./userDB");
const userFirestore_1 = require("./userFirestore");
const pullDb = async () => {
    try {
        const users = await (0, userFirestore_1.FirestoreUserAll)();
        (0, userDB_1.saveAllUser)(users);
        const logins = await (0, loginsFirestore_1.FirestoreLoginAll)();
        (0, loginDB_1.saveAllLogins)(logins);
        console.info('Banco de dados sincronizado com sucesso!');
    }
    catch (error) {
        console.error(`Erro ao sincronizar banco de dados. ${error}`);
    }
};
exports.pullDb = pullDb;
