import { mensagem } from "../../util/getMensagem";
import { UserState } from "../../type/UserState";
import { updateUserState } from "../UserState";
import { MenuLevel } from "../MenuBot";
import { sendText } from "../../util/evolution";

export const DesativarBotService = async (userState: UserState) => {
    userState.process = false;
    userState.opcaoMenu = undefined;
    userState.renovacaoState = undefined;
    userState.menuLevel = MenuLevel.MAIN;
    userState.status = false;
    updateUserState(userState);
    await sendText(userState.remoteJid, mensagem('processo_finalizado'), true);
}