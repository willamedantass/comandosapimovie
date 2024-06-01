import { mensagem } from "../../util/getMensagem";
import { UserState } from "../../type/UserState";
import { updateUserState } from "../UserState";
import { MenuLevel } from "../MenuBot";

export const DesativarBotService = async (userState: UserState, data: any) => {
    userState.process = false;
    userState.opcaoMenu = undefined;
    userState.renovacaoState = undefined;
    userState.menuLevel = MenuLevel.MAIN;
    userState.status = false;
    updateUserState(userState);
    await data.sendText(true, mensagem('processo_finalizado'));
}