"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuEntretenimentoOpcoes = void 0;
const CinemasService_1 = require("./MenuServices/CinemasService");
const DesativarBotService_1 = require("./MenuServices/DesativarBotService");
const JogosDeHojeService_1 = require("./MenuServices/JogosDeHojeService");
const MenuBot_1 = require("./MenuBot");
const jsonConverte_1 = require("../util/jsonConverte");
const UserState_1 = require("./UserState");
const MenuEntretenimentoOpcoes = async (userState, opcaoMenu, conversation, data) => {
    switch (opcaoMenu) {
        case MenuBot_1.MenuEntretenimento.JogosDeHoje:
            const res = await (0, JogosDeHojeService_1.JogosDeHojeService)();
            if (res.result) {
                await data.sendText(true, res.data);
                await (0, DesativarBotService_1.DesativarBotService)(userState, data);
            }
            else {
                await data.sendText(true, res.msg);
            }
            break;
        case MenuBot_1.MenuEntretenimento.Cinemas:
            if (!(userState === null || userState === void 0 ? void 0 : userState.opcaoMenu)) {
                userState.opcaoMenu = MenuBot_1.MenuEntretenimento.Cinemas.toString();
                (0, UserState_1.UpdateUserState)(userState);
                const result = await (0, CinemasService_1.CinemasLocais)();
                if (result.result) {
                    await data.sendText(true, result.data.menu);
                }
                else {
                    userState.opcaoMenu = undefined;
                    (0, UserState_1.UpdateUserState)(userState);
                    await data.sendText(true, result.data.msg);
                }
            }
            else if (userState.opcaoMenu === MenuBot_1.MenuEntretenimento.Cinemas.toString()) {
                if (conversation === 'voltar') {
                    userState.opcaoMenu = undefined;
                    (0, UserState_1.UpdateUserState)(userState);
                    await data.sendText(true, MenuBot_1.menuTexts[MenuBot_1.MenuLevel.MENU_ENTRETENIMENTO]);
                }
                else {
                    if (isNaN(parseInt(conversation))) {
                        return await data.sendText(true, (0, jsonConverte_1.mensagem)('opcao_invalida'));
                    }
                    const selecionada = parseInt(conversation) - 1;
                    const result = await (0, CinemasService_1.CinemasLocais)();
                    if (result.result && selecionada >= 0 && selecionada < result.data.locais.length) {
                        if (userState === null || userState === void 0 ? void 0 : userState.process)
                            return;
                        userState.process = true;
                        (0, UserState_1.UpdateUserState)(userState);
                        const res = await (0, CinemasService_1.CinemaSession)(result.data.locais[selecionada].id);
                        if (!res.result)
                            return await data.reply(res.msg);
                        for (const movie of res.data) {
                            await data.sendImage(movie.image, movie.msg);
                        }
                        await (0, DesativarBotService_1.DesativarBotService)(userState, data);
                    }
                    else {
                        await data.reply((0, jsonConverte_1.mensagem)('opcao_invalida'));
                    }
                }
            }
            break;
        case MenuBot_1.MenuEntretenimento.Voltar:
            userState.opcaoMenu = undefined;
            userState.menuLevel = MenuBot_1.MenuLevel.MAIN;
            (0, UserState_1.UpdateUserState)(userState);
            await data.sendText(true, MenuBot_1.menuTexts[MenuBot_1.MenuLevel.MAIN]);
            break;
        default:
            data.reply((0, jsonConverte_1.mensagem)('opcao_invalida'));
            break;
    }
};
exports.MenuEntretenimentoOpcoes = MenuEntretenimentoOpcoes;
