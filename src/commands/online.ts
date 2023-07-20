import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { readUserFluxo } from "../data/fluxoAcessoDB";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";

export default async ({ reply, owner }: IBotData) => {
    if (owner) {
        const today = new Date();
        today.setMinutes(today.getMinutes() - 5);
        const users: userFluxoAcesso[] = readUserFluxo();
        let online: string = '';

        users.forEach(user => {
            if (new Date(user.data) > today) {
                online += (`\n${user.user.toUpperCase()}`);
            }
        });
        return await reply(`**Clientes Online** ${online}`);
    } else {
        reply(StringsMsg.acessoNegado);
    }
};