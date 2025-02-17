import { RenovacaoStageEnum, RenovacaoState } from "../type/RenovacaoState";
import { DesativarBotService } from "./MenuServices/DesativarBotService";
import { getMensagemLogin, getMensagemPix, mensagem } from "../util/getMensagem";
import { LoginController } from "../controller/loginController";
import { PixController } from "../controller/PixController";
import { MenuLevel, MenuMain, menuTexts } from "./MenuBot";
import { StringClean } from "../util/stringClean";
import { LoginTituloType } from "../type/login";
import { UserState } from "../type/UserState";
import { updateUserState } from "./UserState";
import { LoginFindByUid, loginFindByUser } from "../data/login.service";
import { IUser } from "../type/user.model";
import { userFindByRemoteJid } from "../data/user.service";
import { sendText } from "../util/evolution";

export const MenuMainOpcoes = async (userState: UserState, opcaoMenu: MenuMain, conversation: string) => {
    switch (opcaoMenu) {
        case MenuMain.CriarLogin:
            CriarTeste(userState);
            break;
        case MenuMain.AtivarRenovar:
            AtivarRenovar(userState);
            break;
        case MenuMain.PixCopiaCola:
            PixCopiaECola(userState);
            break;
        case MenuMain.Detalhes:
            Informacoes(userState);
            break;
        case MenuMain.Entretenimento:
            const agora = new Date();
            const expire = new Date(userState.user?.vencimento || '');
            if (expire > agora || userState.user.acesso === 'adm') {
                userState.menuLevel = MenuLevel.MENU_ENTRETENIMENTO;
                updateUserState(userState);
                await sendText(userState.remoteJid, menuTexts[MenuLevel.MENU_ENTRETENIMENTO], true);
            } else {
                await sendText(userState.remoteJid, 'Para acessar essa opcão precisa ser um usuário ativo.', true);
                console.error(`Menu de entretenimento bloqueado!\nUsuario: ${userState.user.nome} - contato: ${userState.user?.remoteJid} - venc.: ${userState.user?.vencimento}`);
                await DesativarBotService(userState);
            }
            break;
        default:
            sendText(userState.remoteJid, 'Opção incorreta. Digite um número válido ou à palavra *sair* para desativar o MovBot.', false, userState.messageId);
            break;
    }
}

const AtivarRenovar = async (userState: UserState) => {
    const isTrial = false;
    const isReneew = true;
    const logins = await LoginFindByUid(userState.user.id);
    const username = StringClean(userState.user.nome);
    const user: IUser | null = await userFindByRemoteJid(userState.user.remoteJid);
    if(!user) {return}

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.selecionar) {
        if (isNaN(parseInt(userState.conversation))) {
            return await sendText(userState.remoteJid, mensagem('opcao_invalida'), true);
        }

        const selecionada = parseInt(userState.conversation) - 1;
        if (selecionada >= 0 && selecionada < logins.length) {
            userState.renovacaoState.selectedLogin = selecionada;
            userState.renovacaoState.stage = RenovacaoStageEnum.confirmar;
            updateUserState(userState);
        } else {
            return await sendText(userState.remoteJid, mensagem('opcao_invalida'), true);
        }
    }

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.confirmar) {
        const login = logins[userState.renovacaoState.selectedLogin || 0];
        if (login) {
            userState.renovacaoState.stage = RenovacaoStageEnum.renovar;
            updateUserState(userState);
            return await sendText(userState.remoteJid, `Login *${login.user}* selecionado, deseja realmente renovar?\nConfirme com Sim ou Não.`, true);
        } else {
            userState.renovacaoState.stage = RenovacaoStageEnum.selecionar;
            return updateUserState(userState);
        }
    }

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.renovar) {
        if (userState.process) {
            return;
        }

        if (userState.conversation === 'nao') {
            await DesativarBotService(userState);
            return;
        } else if (userState.conversation === 'sim') {
            const login = logins[userState.renovacaoState.selectedLogin || 0];
            userState.process = true;
            updateUserState(userState);
            const user: IUser | null = await userFindByRemoteJid(userState.user.remoteJid);
            if (!user) { return };
            const result = await LoginController(login.user, isTrial, isReneew, user);
            if (result.result) {
                const msg: string = getMensagemLogin(result.data.user, result.data.password, result.data.vencimento, LoginTituloType.renovacao);
                await sendText(userState.remoteJid, msg, true);
                await sendText(userState.remoteJid, result.msg, true);
                await DesativarBotService(userState);
                return;
            } else {
                await sendText(userState.remoteJid, `Erro na renovação do login!\n${result.msg}`, true);
                await DesativarBotService(userState);
                return;
            }
        } else {
            await sendText(userState.remoteJid, mensagem('opcao_invalida'), false, userState.messageId);
        }

    }

    if (logins.length > 1) {
        const renovacaoState: RenovacaoState = { stage: RenovacaoStageEnum.selecionar, selectedLogin: null, confirmed: false }
        userState.opcaoMenu = MenuMain.AtivarRenovar.toString();
        userState.renovacaoState = renovacaoState;
        updateUserState(userState);
        let msg = '*Digite uma opção para renovar:*\n'
        for (const [index, login] of logins.entries()) {
            msg += `${index + 1} - ${login.user} | ${new Date(login.vencimento).toLocaleDateString()}\n`;
        }
        await sendText(userState.remoteJid, msg, true);
    } else if (logins.length === 1 || (await loginFindByUser(username))) {
        const userName = logins.length === 1 ? logins[0].user : username;
        const result = await LoginController(userName, isTrial, isReneew, user);

        if (result.result === false) return await sendText(userState.remoteJid, result.msg, true);

        const msg: string = getMensagemLogin(result.data.user, result.data.password, result.data.vencimento, LoginTituloType.renovacao);
        await sendText(userState.remoteJid, msg, true);
        await sendText(userState.remoteJid, result.msg, true);
        await DesativarBotService(userState);
    } else {
        await sendText(userState.remoteJid, mensagem('errorLogin'), false, userState.messageId);
    }
}

const CriarTeste = async (userState: UserState) => {
    const isTrial = true;
    const isReneew = false;
    const username = StringClean(userState.user.nome);
    const user: IUser | null = await userFindByRemoteJid(userState.user.remoteJid);
    if(!user) {return}
    const res = await LoginController(username, isTrial, isReneew, user);
    if (!res.result) {
        await DesativarBotService(userState);
        return await sendText(userState.remoteJid, res.msg, false, userState.messageId)
    }
    const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste);
    await sendText(userState.remoteJid, msg, true);
    await DesativarBotService(userState);
}

const PixCopiaECola = async (userState: UserState) => {
    const pix_data = await PixController(userState.user);
    if (pix_data.result) {
        const msg = getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount);
        await sendText(userState.remoteJid, msg, false);
        await sendText(userState.remoteJid, pix_data?.data.point_of_interaction.transaction_data.qr_code, false);
        await sendText(userState.remoteJid, mensagem('pix'), false);
        await DesativarBotService(userState);
    } else {
        await sendText(userState.remoteJid, pix_data.msg, false);
    }
}

const Informacoes = async (userState: UserState) => {
    const logins = await LoginFindByUid(userState.user.id);

    if (logins.length > 1) {
        await sendText(userState.remoteJid, '*Listando seus logins:*', true);
        for (const login of logins) {
            const msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            await sendText(userState.remoteJid, msg,false);
        }
    } else {
        const username = StringClean(userState.user.nome);
        const login = logins.length === 1 ? logins[0] : (await loginFindByUser(username));
        if (login) {
            const msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            await sendText(userState.remoteJid, msg, true);
        } else {
            await sendText(userState.remoteJid, mensagem('errorLogin'), true);
        }
    }
}