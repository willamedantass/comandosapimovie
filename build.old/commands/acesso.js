"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDB_1 = require("../data/userDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ remoteJid, reply, owner }) => {
    if (owner) {
        let user = (0, userDB_1.searchUser)(remoteJid);
        if (user) {
            if (user.acesso === 'usuario') {
                user.acesso = 'revenda';
                (0, userDB_1.updateUser)(user);
                await reply("✅ Acesso de revendedor liberado!");
            }
            else {
                user.acesso = 'usuario';
                (0, userDB_1.updateUser)(user);
                await reply("❎ Acesso de revendedor removido!");
            }
        }
        else {
            await reply((0, jsonConverte_1.mensagem)('errorUser'));
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
