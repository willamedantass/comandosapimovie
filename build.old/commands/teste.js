"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginController_1 = require("../controller/loginController");
const getMensagem_1 = require("../util/getMensagem");
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
const login_1 = require("../type/login");
const loginDB_1 = require("../data/loginDB");
const userDB_1 = require("../data/userDB");
exports.default = async ({ reply, sendText, remoteJid, args }) => {
    let user = (0, userDB_1.searchUser)(remoteJid);
    if (user) {
        const isTrial = true;
        const isReneew = false;
        let username = (0, stringClean_1.StringClean)(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply((0, jsonConverte_1.mensagem)('errorLoginSize'));
            }
            username = (0, stringClean_1.StringClean)(args);
        }
        const res = await (0, loginController_1.LoginController)(username, isTrial, isReneew, user);
        if (!res.result) {
            return await reply(res.msg);
        }
        const msg = (0, getMensagem_1.getMensagemLogin)(res.data.user, res.data.password, res.data.vencimento, login_1.LoginTituloType.teste);
        await sendText(true, msg);
        await (0, loginDB_1.removeTrial)();
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('errorUser'));
    }
};
