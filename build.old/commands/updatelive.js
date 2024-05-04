"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateLoginsApiClubtv_1 = require("../controller/updateLoginsApiClubtv");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, args, owner }) => {
    if (owner) {
        await (0, updateLoginsApiClubtv_1.updateLoginsApiClubtv)();
        await reply("Comando executado!");
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
