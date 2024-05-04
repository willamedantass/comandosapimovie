"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesativarBotService = void 0;
const jsonConverte_1 = require("../../util/jsonConverte");
const UserState_1 = require("../UserState");
const MenuBot_1 = require("../MenuBot");
const DesativarBotService = async (userState, data) => {
    userState.process = false;
    userState.opcaoMenu = undefined;
    userState.renovacaoState = undefined;
    userState.menuLevel = MenuBot_1.MenuLevel.MAIN;
    userState.status = false;
    (0, UserState_1.UpdateUserState)(userState);
    await data.sendText(true, (0, jsonConverte_1.mensagem)('processo_finalizado'));
};
exports.DesativarBotService = DesativarBotService;
