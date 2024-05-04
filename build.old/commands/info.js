"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const userDB_1 = require("../data/userDB");
const login_1 = require("../type/login");
const getMensagem_1 = require("../util/getMensagem");
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ args, remoteJid, reply, sendText }) => {
    let user = (0, userDB_1.searchUser)(remoteJid);
    if (user) {
        let usr = (0, stringClean_1.StringClean)(user.nome);
        if (args) {
            usr = (0, stringClean_1.StringClean)(args);
        }
        const login = (0, loginDB_1.searchLoginPorUsername)(usr);
        if (login) {
            let msg = (0, getMensagem_1.getMensagemLogin)(login.user, login.password, login.vencimento, login_1.LoginTituloType.info);
            return await sendText(true, msg);
        }
        await reply((0, jsonConverte_1.mensagem)('errorLogin'));
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('errorUser'));
    }
};
