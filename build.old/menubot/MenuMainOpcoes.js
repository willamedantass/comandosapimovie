"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMainOpcoes = void 0;
const loginDB_1 = require("../data/loginDB");
const RenovacaoState_1 = require("../type/RenovacaoState");
const DesativarBotService_1 = require("./MenuServices/DesativarBotService");
const getMensagem_1 = require("../util/getMensagem");
const loginController_1 = require("../controller/loginController");
const PixController_1 = require("../controller/PixController");
const MenuBot_1 = require("./MenuBot");
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
const login_1 = require("../type/login");
const UserState_1 = require("./UserState");
const MenuMainOpcoes = async (userState, opcaoMenu, conversation, data) => {
    var _a;
    switch (opcaoMenu) {
        case MenuBot_1.MenuMain.CriarLogin:
            CriarTeste(userState, data);
            break;
        case MenuBot_1.MenuMain.AtivarRenovar:
            AtivarRenovar(userState, conversation, data);
            break;
        case MenuBot_1.MenuMain.PixCopiaCola:
            PixCopiaECola(userState, data);
            break;
        case MenuBot_1.MenuMain.Detalhes:
            Informacoes(userState, data);
            break;
        case MenuBot_1.MenuMain.Entretenimento:
            const agora = new Date();
            const expire = new Date(((_a = userState.user) === null || _a === void 0 ? void 0 : _a.vencimento) || '');
            if (expire > agora) {
                userState.menuLevel = MenuBot_1.MenuLevel.MENU_ENTRETENIMENTO;
                (0, UserState_1.UpdateUserState)(userState);
                await data.sendText(true, MenuBot_1.menuTexts[MenuBot_1.MenuLevel.MENU_ENTRETENIMENTO]);
            }
            else {
                await data.sendText(true, 'Para acessar essa opcão precisa ser um usuário ativo.');
                await (0, DesativarBotService_1.DesativarBotService)(userState, data);
            }
            break;
        default:
            data.reply('Opção incorreta. Digite um número válido ou à palavra *sair* para desativar o MovBot.');
            break;
    }
};
exports.MenuMainOpcoes = MenuMainOpcoes;
const AtivarRenovar = async (userState, conversation, data) => {
    var _a, _b, _c;
    const isTrial = false;
    const isReneew = true;
    const logins = (0, loginDB_1.searchLoginsPorUId)(userState.user.id);
    const username = (0, stringClean_1.StringClean)(userState.user.nome);
    if (((_a = userState === null || userState === void 0 ? void 0 : userState.renovacaoState) === null || _a === void 0 ? void 0 : _a.stage) === RenovacaoState_1.RenovacaoStageEnum.selecionar) {
        if (isNaN(parseInt(conversation))) {
            return await data.sendText(true, (0, jsonConverte_1.mensagem)('opcao_invalida'));
        }
        const selecionada = parseInt(conversation) - 1;
        if (selecionada >= 0 && selecionada < logins.length) {
            userState.renovacaoState.selectedLogin = selecionada;
            userState.renovacaoState.stage = RenovacaoState_1.RenovacaoStageEnum.confirmar;
            (0, UserState_1.UpdateUserState)(userState);
        }
        else {
            return await data.sendText(true, (0, jsonConverte_1.mensagem)('opcao_invalida'));
        }
    }
    if (((_b = userState === null || userState === void 0 ? void 0 : userState.renovacaoState) === null || _b === void 0 ? void 0 : _b.stage) === RenovacaoState_1.RenovacaoStageEnum.confirmar) {
        const login = logins[userState.renovacaoState.selectedLogin || 0];
        if (login) {
            userState.renovacaoState.stage = RenovacaoState_1.RenovacaoStageEnum.renovar;
            (0, UserState_1.UpdateUserState)(userState);
            return await data.sendText(true, `Login *${login.user}* selecionado, deseja realmente renovar?\nConfirme com Sim ou Não.`);
        }
        else {
            userState.renovacaoState.stage = RenovacaoState_1.RenovacaoStageEnum.selecionar;
            return (0, UserState_1.UpdateUserState)(userState);
        }
    }
    if (((_c = userState === null || userState === void 0 ? void 0 : userState.renovacaoState) === null || _c === void 0 ? void 0 : _c.stage) === RenovacaoState_1.RenovacaoStageEnum.renovar) {
        if (userState.process) {
            return;
        }
        if (conversation === 'nao') {
            await (0, DesativarBotService_1.DesativarBotService)(userState, data);
            return;
        }
        else if (conversation === 'sim') {
            const login = logins[userState.renovacaoState.selectedLogin || 0];
            userState.process = true;
            (0, UserState_1.UpdateUserState)(userState);
            const result = await (0, loginController_1.LoginController)(login.user, isTrial, isReneew, userState.user);
            if (result.result) {
                const msg = (0, getMensagem_1.getMensagemLogin)(result.data.user, result.data.password, result.data.vencimento, login_1.LoginTituloType.renovacao);
                await data.sendText(true, msg);
                await data.sendText(true, result.msg);
                await (0, DesativarBotService_1.DesativarBotService)(userState, data);
                return;
            }
            else {
                await data.sendText(true, `Erro na renovação do login! ${result.msg}`);
                await (0, DesativarBotService_1.DesativarBotService)(userState, data);
                return;
            }
        }
        else {
            await data.reply((0, jsonConverte_1.mensagem)('opcao_invalida'));
        }
    }
    if (logins.length > 1) {
        const renovacaoState = { stage: RenovacaoState_1.RenovacaoStageEnum.selecionar, selectedLogin: null, confirmed: false };
        userState.opcaoMenu = MenuBot_1.MenuMain.AtivarRenovar.toString();
        userState.renovacaoState = renovacaoState;
        (0, UserState_1.UpdateUserState)(userState);
        let msg = '*Digite uma opção para renovar:*\n';
        for (const [index, login] of logins.entries()) {
            msg += `${index + 1} - ${login.user} | ${new Date(login.vencimento).toLocaleDateString()}\n`;
        }
        await data.sendText(true, msg);
    }
    else if (logins.length === 1 || (0, loginDB_1.searchLoginPorUsername)(username)) {
        const user = logins.length === 1 ? logins[0].user : username;
        const result = await (0, loginController_1.LoginController)(user, isTrial, isReneew, userState.user);
        if (result.result === false)
            return await data.sendText(true, result.msg);
        const msg = (0, getMensagem_1.getMensagemLogin)(result.data.user, result.data.password, result.data.vencimento, login_1.LoginTituloType.renovacao);
        await data.sendText(true, msg);
        await data.sendText(true, result.msg);
        await (0, DesativarBotService_1.DesativarBotService)(userState, data);
    }
    else {
        await data.reply(`Você ainda não tem login para ativar ou renovar, crie seu login na opção ${MenuBot_1.MenuMain.CriarLogin + 1}.`);
    }
};
const CriarTeste = async (userState, data) => {
    const isTrial = true;
    const isReneew = false;
    const username = (0, stringClean_1.StringClean)(userState.user.nome);
    const res = await (0, loginController_1.LoginController)(username, isTrial, isReneew, userState.user);
    if (!res.result) {
        return await data.reply(res.msg);
    }
    const msg = (0, getMensagem_1.getMensagemLogin)(res.data.user, res.data.password, res.data.vencimento, login_1.LoginTituloType.teste);
    await data.sendText(true, msg);
};
const PixCopiaECola = async (userState, data) => {
    const pix_data = await (0, PixController_1.PixController)(userState.user);
    if (pix_data.result) {
        const msg = (0, getMensagem_1.getMensagemPix)(pix_data === null || pix_data === void 0 ? void 0 : pix_data.data.id, pix_data === null || pix_data === void 0 ? void 0 : pix_data.data.transaction_amount);
        await data.sendText(false, msg);
        await data.sendText(false, pix_data === null || pix_data === void 0 ? void 0 : pix_data.data.point_of_interaction.transaction_data.qr_code);
        await data.sendText(false, (0, jsonConverte_1.mensagem)('pix'));
        await (0, DesativarBotService_1.DesativarBotService)(userState, data);
    }
    else {
        await data.sendText(true, pix_data.msg);
    }
};
const Informacoes = async (userState, data) => {
    const logins = (0, loginDB_1.searchLoginsPorUId)(userState.user.id);
    if (logins.length > 1) {
        await data.sendText(true, '*Listando seus logins:*');
        for (const login of logins) {
            const msg = (0, getMensagem_1.getMensagemLogin)(login.user, login.password, login.vencimento, login_1.LoginTituloType.info);
            await data.sendText(false, msg);
        }
    }
    else {
        const username = (0, stringClean_1.StringClean)(userState.user.nome);
        const login = logins.length === 1 ? logins[0] : (0, loginDB_1.searchLoginPorUsername)(username);
        if (login) {
            const msg = (0, getMensagem_1.getMensagemLogin)(login.user, login.password, login.vencimento, login_1.LoginTituloType.info);
            await data.sendText(true, msg);
        }
        else {
            await data.sendText(true, (0, jsonConverte_1.mensagem)('errorLogin'));
        }
    }
};
