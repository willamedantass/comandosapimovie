import { readLogins } from "../controller/loginDBController";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";

export default async ({ remoteJid, sendText, reply, owner }: IBotData) => {
    if (owner) {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        const hoje = new Date();
        let login: Login[] = readLogins(remoteJid);
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'
        login.forEach((element, index) => {
            if (new Date(element.vencimento) < hoje) {
                msg += `${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
            }
        });
        await sendText(true, msg);
    } else {
        reply(StringsMsg.acessoNegado);
    }
};