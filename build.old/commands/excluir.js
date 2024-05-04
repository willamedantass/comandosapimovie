"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
const loginDB_1 = require("../data/loginDB");
exports.default = async ({ reply, args, owner }) => {
    if (owner) {
        if (args.length < 8) {
            return await reply((0, jsonConverte_1.mensagem)('errorLoginSize'));
        }
        const username = (0, stringClean_1.StringClean)(args);
        const msg = await (0, loginDB_1.removeLogin)(username);
        await reply(msg);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
