"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, args, owner }) => {
    if (owner) {
        const login = (0, loginDB_1.searchLoginPorUsername)((0, stringClean_1.StringClean)(args));
        if (login) {
            if (login.isLive) {
                login.isLive = false;
                (0, loginDB_1.updateLogin)(login);
                await reply("✅ Acesso live removido!");
            }
            else {
                login.isLive = true;
                (0, loginDB_1.updateLogin)(login);
                await reply("❎ Acesso live liberado!");
            }
        }
        else {
            await reply('Usuário informado não existe!');
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
