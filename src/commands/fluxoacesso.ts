import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { readUserFluxo } from "../data/fluxoAcessoDB";
import { IBotData } from "../Interface/IBotData";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";


export default async ({ sendText, reply, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const users: userFluxoAcesso[] = readUserFluxo();
        let online: string = '';
        const options = { timeZone: 'America/Sao_Paulo', hour12: false }

        if (!users.length) {
            return await reply('Nenhum usuário conectado.');
        }

        users.forEach(user => {
            online += (`\n
            ${user.user.toUpperCase()} - 
            Acesso: ${new Date(user.data).toLocaleString('pt-br', options)}`);
        });

        await sendText(true, `   **Clientes Online** ${online}`);
    } else {
        await reply(mensagem('acessoNegado'));
    }
};