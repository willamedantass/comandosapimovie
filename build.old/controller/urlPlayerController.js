"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLogin = exports.urlPlayerController = void 0;
const fluxoAcessoDB_1 = require("../data/fluxoAcessoDB");
const livePassDB_1 = require("../data/livePassDB");
const loginDB_1 = require("../data/loginDB");
const LoginApiController_1 = require("./LoginApiController");
const isVencimentoController_1 = require("./isVencimentoController");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const sendMessage_1 = require("../util/sendMessage");
require('dotenv/config');
const urlPlayerController = async (req, res) => {
    const { media, user, password } = req.params;
    const video = req.params.video.substring(1);
    const idProvedor = req.params.video.charAt(0);
    let login = (0, loginDB_1.searchLoginPorUsername)(user);
    if (!login) {
        console.log(`Usuário inválido! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }
    if (password !== login.password) {
        console.log(`Senha inválida! Senha usada: ${password}`);
        return res.json({ "user_info": { "auth": 0 } });
    }
    const isVencido = await (0, isVencimentoController_1.isVencimentoController)(login);
    if (isVencido) {
        return res.json({ "user_info": { "auth": 0 } });
    }
    if (media === 'live' && !login.isLive) {
        return res.json({ "user_info": { "auth": 0 } });
    }
    const agora = new Date();
    const remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
        req.connection.remoteAddress || // Recupera o endereço remoto da chamada
        req.socket.remoteAddress || // Recupera o endereço através do socket TCP
        req.connection.socket.remoteAddress; // Recupera o endereço através do socket da conexão
    if (remoteIp !== (login === null || login === void 0 ? void 0 : login.remoteIp)) {
        const dataRemote = (login === null || login === void 0 ? void 0 : login.dataRemote) ? new Date(login.dataRemote) : dataAcesso(-15);
        if (agora > dataRemote) {
            login.remoteIp = remoteIp;
            login.dataRemote = dataAcesso(15).toISOString();
            (0, loginDB_1.updateLoginLocal)(login);
        }
        else {
            console.log('Acesso remoto não permitido, houve tentativa de acesso duplicado.');
            const countForbiddenAccess = login.countForbiddenAccess || 0;
            login.countForbiddenAccess = countForbiddenAccess + 1;
            (0, loginDB_1.updateLoginLocal)(login);
            return res.json({ "user_info": { "auth": 0 } });
        }
    }
    const generatedLink = await getUrl(idProvedor, media, video, login.user);
    console.log(`Link Gerado: ${generatedLink}`);
    if (!generatedLink) {
        return res.status(404).end();
    }
    res.set('location', generatedLink);
    res.status(301).send();
};
exports.urlPlayerController = urlPlayerController;
const getUrl = async (idProvedor, media, video, user) => {
    let acesso = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idProvedor);
    if (acesso) {
        if (media === 'live') {
            return await (0, exports.processLogin)(idProvedor, acesso === null || acesso === void 0 ? void 0 : acesso.dns, media, video, user);
        }
        else {
            //busca outros logins para reproduzir os filmes e series do mesmo provedor de live
            const idLive = process.env.PROVEDOR_LIVES_ID;
            if (acesso.id === idLive) {
                const login = (0, livePassDB_1.unusedUserLivePass)(true);
                acesso.user = login.username;
                acesso.password = login.password;
            }
            return `${acesso === null || acesso === void 0 ? void 0 : acesso.dns}/${media}/${acesso === null || acesso === void 0 ? void 0 : acesso.user}/${acesso === null || acesso === void 0 ? void 0 : acesso.password}/${video}`;
        }
    }
};
const processLogin = async (provedor, dnsProvedor, media, video, user) => {
    let livePass;
    (0, fluxoAcessoDB_1.processUserFluxo)();
    const userAcesso = (0, fluxoAcessoDB_1.readUserFluxo)().find(userFluxo => userFluxo.user === user);
    if (userAcesso) {
        livePass = (0, livePassDB_1.searchLivePass)(userAcesso.login);
        if (!(livePass === null || livePass === void 0 ? void 0 : livePass.isDelete)) {
            (0, fluxoAcessoDB_1.updateUserFluxo)(userAcesso);
            return `${dnsProvedor}/${media}/${userAcesso.login}/${userAcesso.password}/${video}`;
        }
    }
    let isRandom = false;
    livePass = (0, livePassDB_1.unusedUserLivePass)(isRandom);
    if (livePass) {
        (0, fluxoAcessoDB_1.createUserFluxo)(user, livePass);
        return `${dnsProvedor}/${media}/${livePass.username}/${livePass.password}/${video}`;
    }
    const result = await (0, LoginApiController_1.CreateLoginApi)();
    if (!result) {
        isRandom = true;
        livePass = (0, livePassDB_1.unusedUserLivePass)(isRandom);
        await (0, sendMessage_1.sendMessage)('8588199556', `Logins esgotados!\nUsuário ${user} - Login ${livePass.username}`);
        return `${dnsProvedor}/${media}/${livePass.username}/${livePass.password}/${video}`;
    }
    const expired = (0, livePassDB_1.readLivePass)().filter(user => (user === null || user === void 0 ? void 0 : user.isDelete) == true);
    for (let user of expired) {
        await (0, LoginApiController_1.deleteLoginAPI)(user.id);
        (0, livePassDB_1.deleteLivePass)(user.username);
    }
    return (0, exports.processLogin)(provedor, dnsProvedor, media, video, user);
};
exports.processLogin = processLogin;
const dataAcesso = (minutes) => {
    let dataAcesso = new Date();
    dataAcesso.setMinutes(dataAcesso.getMinutes() + minutes);
    return dataAcesso;
};
const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
