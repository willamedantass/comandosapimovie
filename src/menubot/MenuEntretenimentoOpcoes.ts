import { CinemaSession, CinemasLocais } from "./MenuServices/CinemasService";
import { DesativarBotService } from "./MenuServices/DesativarBotService";
import { JogosDeHojeService } from "./MenuServices/JogosDeHojeService";
import { MenuEntretenimento, MenuLevel, menuTexts } from "./MenuBot";
import { UserState } from "../type/UserState";
import { mensagem } from "../util/getMensagem";
import { updateUserState } from "./UserState";
import { geminiChat } from "../util/gemini";
import { sendText } from "../util/evolution";

export const MenuEntretenimentoOpcoes = async (userState: UserState, opcaoMenu: MenuEntretenimento) => {
    switch (opcaoMenu) {
        case MenuEntretenimento.JogosDeHoje:
            const res = await JogosDeHojeService();
            if (res.result) {
                await sendText(userState.remoteJid, res.data, true);
                await DesativarBotService(userState);
            } else {
                await sendText(userState.remoteJid, res.msg, true);
            }
            break;
        case MenuEntretenimento.Cinemas:
            if (!userState?.opcaoMenu) {
                userState.opcaoMenu = MenuEntretenimento.Cinemas.toString();
                updateUserState(userState);
                const result = await CinemasLocais();
                if (result.result) {
                    await sendText(userState.remoteJid, result.data.menu, true);
                } else {
                    userState.opcaoMenu = undefined;
                    updateUserState(userState);
                    await sendText(userState.remoteJid, result.data.msg, true);
                }
            } else if (userState.opcaoMenu === MenuEntretenimento.Cinemas.toString()) {
                if (userState.conversation === 'voltar') {
                    userState.opcaoMenu = undefined;
                    updateUserState(userState);
                    await sendText(userState.remoteJid, menuTexts[MenuLevel.MENU_ENTRETENIMENTO], true);
                } else {
                    if (isNaN(parseInt(userState.conversation))) {
                        return await sendText(userState.remoteJid, mensagem('opcao_invalida'), true);
                    }

                    const selecionada = parseInt(userState.conversation) - 1;
                    const result = await CinemasLocais();
                    if (result.result && selecionada >= 0 && selecionada < result.data.locais.length) {
                        if (userState?.process) return;
                        userState.process = true;
                        updateUserState(userState);
                        const res = await CinemaSession(result.data.locais[selecionada].id);
                        if (!res.result) return await sendText(userState.remoteJid, res.msg, false, userState.messageId);
                        for (const movie of res.data) {
                            // await data.sendImage(movie.image, movie.msg);
                        }
                        await DesativarBotService(userState);
                    } else {
                        await sendText(userState.remoteJid, mensagem('opcao_invalida'), false, userState.messageId);
                    }
                }
            }
            break;
        case MenuEntretenimento.GenioVirtual:
            if(userState.conversation === 'sair'){
                await DesativarBotService(userState);
            }

            if (!userState?.opcaoMenu) {
                userState.opcaoMenu = MenuEntretenimento.GenioVirtual.toString();
                updateUserState(userState);
                await sendText(userState.remoteJid, 'Olá! Eu sou o seu assistente inteligente, sempre pronto para resolver suas dúvidas e fornecer informações precisas e rápidas.\n\nPara desativar, basta digitar "sair".\n\nPara começar, basta deixar sua pergunta aqui.', true);
                return
            }

            if(userState.process) return await sendText(userState.remoteJid,'Estamos processando sua pergunta, por favor aguarde.', false);
            
            userState.process = true;
            updateUserState(userState);
            const resposta = await geminiChat(userState.conversation) || "";
            await sendText(userState.remoteJid, resposta, false);
            userState.process = false
            updateUserState(userState);
            break;
        case MenuEntretenimento.Voltar:
            userState.opcaoMenu = undefined;
            userState.menuLevel = MenuLevel.MAIN;
            updateUserState(userState);
            await sendText(userState.remoteJid, menuTexts[MenuLevel.MAIN], true);
            break;
        default:
            sendText(userState.remoteJid, mensagem('opcao_invalida'), false, userState.messageId);
            break;
    }
}