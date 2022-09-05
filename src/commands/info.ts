import { buscarLogin } from "../controller/loginDBController";
import { buscarUser } from "../controller/userDBController";
import { Login, LoginTituloType } from "../type/login";
import { getMensagemLogin } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { User } from "../type/user";

export default async ({ args, remoteJid, reply, sendText, owner }: IBotData) => {
    let user: User = buscarUser(remoteJid);
    if (user) {
        let usr: string =  StringClean(user.nome);
        if (args && owner) {
            usr = StringClean(args);
        }
        const login: Login = buscarLogin(usr);
        if(login){
            let msg:string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            return await sendText(true, msg);
        }
        reply(StringsMsg.errorLogin);
    } else {
        reply(StringsMsg.errorUser);
    }
}