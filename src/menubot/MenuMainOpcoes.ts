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

export const MenuMainOpcoes = async (userState: UserState, opcaoMenu: MenuMain, conversation: string, data: any) => {
    switch (opcaoMenu) {
        case MenuMain.CriarLogin:
            CriarTeste(userState, data);
            break;
        case MenuMain.AtivarRenovar:
            AtivarRenovar(userState, conversation, data);
            break;
        case MenuMain.PixCopiaCola:
            PixCopiaECola(userState, data);
            break;
        case MenuMain.Detalhes:
            Informacoes(userState, data);
            break;
        case MenuMain.Entretenimento:
            const agora = new Date();
            const expire = new Date(userState.user?.vencimento || '');
            if (expire > agora) {
                userState.menuLevel = MenuLevel.MENU_ENTRETENIMENTO;
                updateUserState(userState);
                await data.sendText(true, menuTexts[MenuLevel.MENU_ENTRETENIMENTO]);
            } else {
                await data.sendText(true, 'Para acessar essa opcão precisa ser um usuário ativo.');
                await DesativarBotService(userState, data);
            }
            break;
        default:
            data.reply('Opção incorreta. Digite um número válido ou à palavra *sair* para desativar o MovBot.');
            break;
    }
}

const AtivarRenovar = async (userState: UserState, conversation: string, data: any) => {
    const isTrial = false;
    const isReneew = true;
    const logins = await LoginFindByUid(userState.user.id);
    const username = StringClean(userState.user.nome);
    const user: IUser | null = await userFindByRemoteJid(userState.user.remoteJid);
    if(!user) {return}

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.selecionar) {
        if (isNaN(parseInt(conversation))) {
            return await data.sendText(true, mensagem('opcao_invalida'));
        }

        const selecionada = parseInt(conversation) - 1;
        if (selecionada >= 0 && selecionada < logins.length) {
            userState.renovacaoState.selectedLogin = selecionada;
            userState.renovacaoState.stage = RenovacaoStageEnum.confirmar;
            updateUserState(userState);
        } else {
            return await data.sendText(true, mensagem('opcao_invalida'))
        }
    }

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.confirmar) {
        const login = logins[userState.renovacaoState.selectedLogin || 0];
        if (login) {
            userState.renovacaoState.stage = RenovacaoStageEnum.renovar;
            updateUserState(userState);
            return await data.sendText(true, `Login *${login.user}* selecionado, deseja realmente renovar?\nConfirme com Sim ou Não.`)
        } else {
            userState.renovacaoState.stage = RenovacaoStageEnum.selecionar;
            return updateUserState(userState);
        }
    }

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.renovar) {
        if (userState.process) {
            return;
        }

        if (conversation === 'nao') {
            await DesativarBotService(userState, data);
            return;
        } else if (conversation === 'sim') {
            const login = logins[userState.renovacaoState.selectedLogin || 0];
            userState.process = true;
            updateUserState(userState);
            const user: IUser | null = await userFindByRemoteJid(userState.user.remoteJid);
            if (!user) { return };
            const result = await LoginController(login.user, isTrial, isReneew, user);
            if (result.result) {
                const msg: string = getMensagemLogin(result.data.user, result.data.password, result.data.vencimento, LoginTituloType.renovacao);
                await data.sendText(true, msg);
                await data.sendText(true, result.msg);
                await DesativarBotService(userState, data);
                return;
            } else {
                await data.sendText(true, `Erro na renovação do login!\n${result.msg}`);
                await DesativarBotService(userState, data);
                return;
            }
        } else {
            await data.reply(mensagem('opcao_invalida'));
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
        await data.sendText(true, msg);
    } else if (logins.length === 1 || (await loginFindByUser(username))) {
        const userName = logins.length === 1 ? logins[0].user : username;
        const result = await LoginController(userName, isTrial, isReneew, user);

        if (result.result === false) return await data.sendText(true, result.msg);

        const msg: string = getMensagemLogin(result.data.user, result.data.password, result.data.vencimento, LoginTituloType.renovacao);
        await data.sendText(true, msg);
        await data.sendText(true, result.msg);
        await DesativarBotService(userState, data);
    } else {
        await data.reply(mensagem('errorLogin'));
    }
}

const CriarTeste = async (userState: UserState, data: any) => {
    const isTrial = true;
    const isReneew = false;
    const username = StringClean(userState.user.nome);
    const user: IUser | null = await userFindByRemoteJid(userState.user.remoteJid);
    if(!user) {return}
    const res = await LoginController(username, isTrial, isReneew, user);
    if (!res.result) {
        await DesativarBotService(userState, data);
        return await data.reply(res.msg)
    }
    const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste);
    await data.sendText(true, msg);
    await DesativarBotService(userState, data);
}

const PixCopiaECola = async (userState: UserState, data: any) => {
    const pix_data = await PixController(userState.user);
    if (pix_data.result) {
        const msg = getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount);
        await data.sendText(false, msg);
        await data.sendText(false, pix_data?.data.point_of_interaction.transaction_data.qr_code);
        await data.sendText(false, mensagem('pix'));
        await DesativarBotService(userState, data);
    } else {
        await data.sendText(true, pix_data.msg);
    }
}

const Informacoes = async (userState: UserState, data: any) => {
    const logins = await LoginFindByUid(userState.user.id);

    if (logins.length > 1) {
        await data.sendText(true, '*Listando seus logins:*');
        for (const login of logins) {
            const msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            await data.sendText(false, msg);
        }
    } else {
        const username = StringClean(userState.user.nome);
        const login = logins.length === 1 ? logins[0] : (await loginFindByUser(username));
        if (login) {
            const msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            await data.sendText(true, msg);
        } else {
            await data.sendText(true, mensagem('errorLogin'));
        }
    }
}