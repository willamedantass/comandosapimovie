import { CinemaSession, CinemasLocais } from "./MenuServices/CinemasService";
import { DesativarBotService } from "./MenuServices/DesativarBotService";
import { JogosDeHojeService } from "./MenuServices/JogosDeHojeService";
import { MenuEntretenimento, MenuLevel, menuTexts } from "./MenuBot";
import { mensagem } from "../util/jsonConverte";
import { UpdateUserState } from "./UserState";
import { UserState } from "../type/UserState";

export const MenuEntretenimentoOpcoes = async (userState: UserState, opcaoMenu: MenuEntretenimento, conversation: string, data: any) => {
    switch (opcaoMenu) {
        case MenuEntretenimento.JogosDeHoje:
            const res = await JogosDeHojeService();
            if (res.result) {
                await data.sendText(true, res.data);
                await DesativarBotService(userState, data);
            } else {
                await data.sendText(true, res.msg);
            }
            break;
        case MenuEntretenimento.Cinemas:
            if (!userState?.opcaoMenu) {
                userState.opcaoMenu = MenuEntretenimento.Cinemas.toString();
                UpdateUserState(userState);
                const result = await CinemasLocais();
                if (result.result) {
                    await data.sendText(true, result.data.menu);
                } else {
                    userState.opcaoMenu = undefined;
                    UpdateUserState(userState);
                    await data.sendText(true, result.data.msg);
                }
            } else if (userState.opcaoMenu === MenuEntretenimento.Cinemas.toString()) {
                if (conversation === 'voltar') {
                    userState.opcaoMenu = undefined;
                    UpdateUserState(userState);
                    await data.sendText(true, menuTexts[MenuLevel.MENU_ENTRETENIMENTO]);
                } else {
                    if (isNaN(parseInt(conversation))) {
                        return await data.sendText(true, mensagem('opcao_invalida'));
                    }

                    const selecionada = parseInt(conversation) - 1;
                    const result = await CinemasLocais();
                    if (result.result && selecionada >= 0 && selecionada < result.data.locais.length) {
                        if (userState?.process) return;
                        userState.process = true;
                        UpdateUserState(userState);
                        const res = await CinemaSession(result.data.locais[selecionada].id);
                        if (!res.result) return await data.reply(res.msg);
                        for (const movie of res.data) {
                            await data.sendImage(movie.image, movie.msg);
                        }
                        await DesativarBotService(userState, data);
                    } else {
                        await data.reply(mensagem('opcao_invalida'));
                    }
                }
            }
            break;
        case MenuEntretenimento.Voltar:
            userState.opcaoMenu = undefined;
            userState.menuLevel = MenuLevel.MAIN;
            UpdateUserState(userState);
            await data.sendText(true, menuTexts[MenuLevel.MAIN]);
            break;
        default:
            data.reply('Opção incorreta. Digite um número válido ou à palavra *sair* para desativar o MovBot.');
            break;
    }
}