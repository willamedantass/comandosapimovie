import { searchLoginPorUsername, searchLoginsPorUId } from "../data/loginDB";
import { RenovacaoStageEnum, RenovacaoState } from "../type/RenovacaoState";
import { getMensagemLogin, getMensagemPix } from "../util/getMensagem";
import { LoginController } from "../controller/loginController";
import { PixController } from "../controller/PixController";
import { StringClean } from "../util/stringClean";
import { mensagem } from "../util/jsonConverte";
import { LoginTituloType } from "../type/login";
import { UserState } from "../type/UserState";
import { updateUserState } from "./UserState";
import { MenuMain } from "./Menu";

export const ConversationMenuMain = async (userState: UserState, opcaoMenu: MenuMain, conversation: string, data: any) => {
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
        default:
            data.reply('Opção incorreta. Digite um número válido ou à palavra *sair* para desativar o MovBot.');
            break;
    }
}

const AtivarRenovar = async (userState: UserState, conversation: string, data: any) => {
    const isTrial = false;
    const isReneew = true;
    const logins = searchLoginsPorUId(userState.user.id);

    if (userState?.renovacaoState?.stage === RenovacaoStageEnum.selecionar) {
        if (isNaN(parseInt(conversation))) {
            return await data.sendText(true, 'Opção inválida!');
        }

        const selecionada = parseInt(conversation) - 1;
        if (selecionada >= 0 && selecionada < logins.length) {
            userState.renovacaoState.selectedLogin = selecionada;
            userState.renovacaoState.stage = RenovacaoStageEnum.confirmar;
            updateUserState(userState);
        } else {
            return await data.sendText(true, 'Opção inválida!')
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
            userState.renovacaoState = undefined;
            userState.opcaoMenu = undefined;
            userState.process = false;
            userState.status = false;
            updateUserState(userState);
            await data.sendText(true, mensagem('menu_cancelado'));
            return;
        } else if (conversation === 'sim') {
            const login = logins[userState.renovacaoState.selectedLogin || 0];
            userState.process = true;
            updateUserState(userState);
            const result = LoginController(login.user, isTrial, isReneew, userState.user);
            userState.renovacaoState = undefined;
            userState.opcaoMenu = undefined;
            userState.process = false;
            userState.status = false;
            updateUserState(userState);
            if (result.result) {
                const msg: string = getMensagemLogin(result.data.user, result.data.password, result.data.vencimento, LoginTituloType.renovacao);
                await data.sendText(true, msg);
                await data.sendText(true, result.msg);
                return;
            } else {
                await data.sendText(true, `Erro na renovação do login! ${result.msg}`);
                await data.sendText(false, mensagem('menu_cancelado'));
                return;
            }
        } else {
            await data.reply('Opção inválida.');
        }

    }

    if (logins.length > 1) {
        const renovacaoState: RenovacaoState = { stage: RenovacaoStageEnum.selecionar, selectedLogin: null, confirmed: false }
        userState.opcaoMenu = (MenuMain.AtivarRenovar + 1).toString();
        userState.renovacaoState = renovacaoState;
        updateUserState(userState);
        let msg = '*Digite uma opção para renovar:*\n'
        for (const [index, login] of logins.entries()) {
            msg += `${index + 1} - ${login.user} | ${new Date(login.vencimento).toLocaleDateString()}\n`;
        }
        await data.sendText(true, msg);
    } else if(logins.length === 1) {
        const username = logins.length === 1 ? logins[0].user : StringClean(userState.user.nome);
        const result = LoginController(username, isTrial, isReneew, userState.user);
        if (result.result) {
            const msg: string = getMensagemLogin(result.data.user, result.data.password, result.data.vencimento, LoginTituloType.renovacao);
            await data.sendText(true, msg);
            await data.sendText(true, result.msg);
        } else {
            await data.sendText(true, result.msg);
        }
    } else {
        await data.reply(`Você ainda não tem login para ativar ou renovar, crie seu login na opção ${MenuMain.CriarLogin + 1}.`);
    }

}

const CriarTeste = async (userState: UserState, data: any) => {
    const isTrial = true;
    const isReneew = false;
    const username = StringClean(userState.user.nome);
    const res = LoginController(username, isTrial, isReneew, userState.user);
    if (!res.result) {
        return await data.reply(res.msg)
    }
    const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste);
    await data.sendText(true, msg);
}

const PixCopiaECola = async (userState: UserState, data: any) => {
    const pix_data = await PixController(userState.user);
    if (pix_data.result) {
        const msg = getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount);
        await data.sendText(false, msg);
        await data.sendText(false, pix_data?.data.point_of_interaction.transaction_data.qr_code);
        await data.sendText(false, mensagem('pix'));
        // removeUserState(user.remoteJid);
    } else {
        await data.sendText(true, pix_data.msg);
    }
}

const Informacoes = async (userState: UserState, data: any) => {
    const logins = searchLoginsPorUId(userState.user.id);
    if (logins.length > 1) {
        await data.sendText(true, '*Listando seus logins:*');
        for (const login of logins) {
            const msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            await data.sendText(false, msg);
        }
    } else {
        const username = StringClean(userState.user.nome);
        const login = logins.length === 1 ? logins[0] : searchLoginPorUsername(username);
        if (login) {
            const msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            await data.sendText(true, msg);
        } else {
            await data.sendText(true, mensagem('errorLogin'));
        }
    }
}