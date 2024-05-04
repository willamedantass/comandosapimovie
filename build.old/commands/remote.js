"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ args, reply, sendText, owner }) => {
    if (owner) {
        let login = (0, loginDB_1.searchLoginPorUsername)(args);
        if (login) {
            (login === null || login === void 0 ? void 0 : login.remoteIp) ? login.remoteIp = "" : login["remoteIp"] = "";
            (login === null || login === void 0 ? void 0 : login.countForbiddenAccess) ? login.countForbiddenAccess = 0 : login["countForbiddenAccess"] = 0;
            (login === null || login === void 0 ? void 0 : login.dataRemote) ? login.dataRemote = "" : login["dataRemote"] = "";
            (0, loginDB_1.updateLoginLocal)(login);
            return await sendText(true, "Acesso remoto redefinido!");
        }
        else {
            await reply((0, jsonConverte_1.mensagem)('errorLogin'));
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
