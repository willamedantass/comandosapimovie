import { IBotData } from "../Interface/IBotData";
import { loginsAll } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";

export default async ({ sendText, reply, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
        (await loginsAll()).forEach((element, index) => {
            msg += `${index + 1} - ${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
        });
        await sendText(true, msg);
    } else {
        await reply(mensagem('acessoNegado'));
    }
};