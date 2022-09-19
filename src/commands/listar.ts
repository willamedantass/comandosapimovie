import { buscarUser, updateUser } from "../controller/userDBController";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Acesso, User } from "../type/user";
import { Login } from "../type/login";
import { readLogins } from "../controller/loginDBController";

export default async ({ remoteJid, sendText, reply, owner }: IBotData) => {
    if (owner) {
        const options = {timeZone: 'America/Sao_Paulo', hour12: false};
        let login: Login[] = readLogins(remoteJid);
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'
        login.forEach((element, index) => {
            msg += `${index+1} - ${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
        });
        await sendText(true, msg);
    } else {
        reply(StringsMsg.acessoNegado);
    }
};