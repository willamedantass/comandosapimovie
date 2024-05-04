"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const userDB_1 = require("../data/userDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, owner, remoteJid, args }) => {
    if (owner) {
        let login = (0, loginDB_1.searchLoginPorUsername)(args);
        const user = (0, userDB_1.searchUser)(remoteJid);
        if (login && user) {
            login.uid = user.id;
            login.contato = remoteJid.replace('55', '').split('@')[0];
            user.vencimento = login.vencimento;
            await (0, userDB_1.updateUser)(user);
            await (0, loginDB_1.updateLogin)(login);
            await reply('Login atualizado!');
        }
        else {
            await reply((0, jsonConverte_1.mensagem)('errorLogin'));
        }
    }
    else {
        reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
