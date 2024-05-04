"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginController_1 = require("../controller/loginController");
const loginDB_1 = require("../data/loginDB");
const getMensagem_1 = require("../util/getMensagem");
const login_1 = require("../type/login");
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
const userDB_1 = require("../data/userDB");
exports.default = async ({ sendText, reply, remoteJid, args }) => {
    let user = (0, userDB_1.searchUser)(remoteJid);
    if (user) {
        let username = (0, stringClean_1.StringClean)(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply((0, jsonConverte_1.mensagem)('errorLoginSize'));
            }
            username = (0, stringClean_1.StringClean)(args);
        }
        let login = (0, loginDB_1.searchLoginPorUsername)(username);
        if (login) {
            const isTrial = false;
            const isReneew = true;
            const res = await (0, loginController_1.LoginController)(username, isTrial, isReneew, user);
            if (!res.result) {
                return await reply(res.msg);
            }
            const msg = (0, getMensagem_1.getMensagemLogin)(login.user, '', res.data.vencimento, login_1.LoginTituloType.renovacao);
            await sendText(true, msg);
            await sendText(true, res.msg);
        }
        else {
            await reply((0, jsonConverte_1.mensagem)('errorLogin'));
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('errorUser'));
    }
};
