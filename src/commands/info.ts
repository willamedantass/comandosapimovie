import { searchLoginPorUsername } from "../data/loginDB";
import { searchUser } from "../data/userDB";
import { Login, LoginTituloType } from "../type/login";
import { getMensagemLogin } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { User } from "../type/user";

export default async ({ args, remoteJid, reply, sendText, owner }: IBotData) => {
    let user: User | undefined = searchUser(remoteJid);
    if (user) {
        let usr: string = StringClean(user.nome);
        if (args && owner) {
            usr = StringClean(args);
        }
        const login: Login | undefined = searchLoginPorUsername(usr);
        if (login) {
            let msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            return await sendText(true, msg);
        }
        await reply(mensagem('errorLogin'));
    } else {
        await reply(mensagem('errorUser'));
    }
}