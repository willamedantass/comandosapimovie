import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { readUserFluxo } from "../data/fluxoAcessoDB";
import { IBotData } from "../Interface/IBotData";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
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
        await reply(mensagem('acessoNegado'));
    }
};