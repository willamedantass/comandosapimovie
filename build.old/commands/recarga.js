"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDB_1 = require("../data/userDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ owner, remoteJid, args, reply }) => {
    if (owner) {
        let user = (0, userDB_1.searchUser)(remoteJid);
        if (!user) {
            return await reply((0, jsonConverte_1.mensagem)('errorUser'));
        }
        if (!args) {
            return await reply((0, jsonConverte_1.mensagem)('errorArgs'));
        }
        let credito = parseInt(args);
        if (!credito) {
            return await reply((0, jsonConverte_1.mensagem)('errorArgs'));
        }
        user.credito += credito;
        (0, userDB_1.updateUser)(user);
        await reply((0, jsonConverte_1.mensagem)('recarga') + user.credito);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
