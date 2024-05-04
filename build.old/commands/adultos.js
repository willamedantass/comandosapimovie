"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const stringClean_1 = require("../util/stringClean");
exports.default = async ({ reply, args }) => {
    const login = (0, loginDB_1.searchLoginPorUsername)((0, stringClean_1.StringClean)(args));
    if (login) {
        if (login === null || login === void 0 ? void 0 : login.isAdult) {
            login.isAdult = false;
            await (0, loginDB_1.updateLogin)(login);
            await reply("✅ Acesso canais/filmes adultos removido!");
        }
        else {
            login.isAdult = true;
            await (0, loginDB_1.updateLogin)(login);
            await reply("❎ Acesso canais/filmes adultos liberado!");
        }
    }
    else {
        reply('Usuário informado não existe!');
    }
};
