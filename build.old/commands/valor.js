"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDB_1 = require("../data/userDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, remoteJid, args, owner }) => {
    if (owner) {
        if (isNaN(parseInt(args))) {
            return await reply('Argumento não é um valor aceito.');
        }
        let user = (0, userDB_1.searchUser)(remoteJid);
        if (user) {
            user.valor = args.trim();
            await (0, userDB_1.updateUser)(user);
            await reply('Valor de venda atualizado!');
        }
        else {
            await reply('Usuário informado não existe!');
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
