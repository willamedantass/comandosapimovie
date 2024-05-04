"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const loginDB_1 = require("../data/loginDB");
const getRandomString_1 = require("../util/getRandomString");
const isCreateTest_1 = require("../util/isCreateTest");
const jsonConverte_1 = require("../util/jsonConverte");
const userDB_1 = require("../data/userDB");
const uid_1 = require("uid");
const LoginController = async (username, isTrial, isReneew, user) => {
    let credito = user.credito ? user.credito : 0;
    let result = { result: false, msg: '' };
    if (username.length < 8) {
        result = { result: false, msg: (0, jsonConverte_1.mensagem)('errorLoginSize') };
        return result;
    }
    const login = (0, loginDB_1.searchLoginPorUsername)(username);
    if (login && !isReneew) {
        result = { result: false, msg: (0, jsonConverte_1.mensagem)('user_existe') };
        return result;
    }
    if (isTrial && user.acesso === 'usuario' && !(0, isCreateTest_1.isCriarTeste)(user === null || user === void 0 ? void 0 : user.data_teste)) {
        result = { result: false, msg: (0, jsonConverte_1.mensagem)('limite') };
        return result;
    }
    if (!isTrial && credito <= 0) {
        result = { result: false, msg: (0, jsonConverte_1.mensagem)('errorSaldo') };
        return result;
    }
    const agora = new Date();
    let vencimento = (login === null || login === void 0 ? void 0 : login.vencimento) ? new Date(login.vencimento) : new Date();
    if (isTrial) {
        vencimento = new Date();
        vencimento.setHours(agora.getHours() + 6);
    }
    else if (vencimento > agora) {
        vencimento.setDate(vencimento.getDate() + 30);
        vencimento.setHours(23, 59, 59, 998);
    }
    else {
        vencimento = new Date();
        vencimento.setDate(agora.getDate() + 30);
        vencimento.setHours(23, 59, 59, 998);
    }
    if (login) {
        login.vencimento = vencimento.toISOString();
        login.isTrial = false;
        login.uid = (user === null || user === void 0 ? void 0 : user.id) ? user.id : '';
        login.contato = user.remoteJid.split('@')[0];
        await (0, loginDB_1.updateLogin)(login);
        result = { result: true, msg: 'Login ativado com sucesso.', data: login };
    }
    else {
        const loginNew = {
            id: (0, uid_1.uid)(8),
            uid: (user === null || user === void 0 ? void 0 : user.id) ? user.id : '',
            user: username,
            contato: user.remoteJid.split('@')[0],
            password: (0, getRandomString_1.getRandomString)(),
            dataCadastro: new Date().toISOString(),
            vencimento: vencimento.toISOString(),
            isLive: true,
            isTrial: isTrial ? true : false
        };
        await (0, loginDB_1.criarLogin)(loginNew);
        result = { result: true, msg: 'Login criado com sucesso.', data: loginNew };
    }
    if (!isTrial) {
        user.credito -= 1;
        result.msg = `Seu novo saldo em crédito: ${user.credito}`;
    }
    isTrial && (user.data_teste = new Date().toISOString());
    user.vencimento = vencimento.toISOString();
    await (0, userDB_1.updateUser)(user);
    return result;
};
exports.LoginController = LoginController;
