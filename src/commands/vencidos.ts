import { IBotData } from "../Interface/IBotData";
import { loginsAll } from "../data/login.service";
import { ILogin } from "../type/login.model";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";

export default async ({ sendText, reply, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        const hoje = new Date();
        let logins: ILogin[] = await loginsAll();
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'
        logins.forEach((element, _) => {
            if (new Date(element.vencimento) < hoje) {
                msg += `${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
            }
        });
        await sendText(true, msg);
    } else {
        await reply(mensagem('acessoNegado'));
    }
};