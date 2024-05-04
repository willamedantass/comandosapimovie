import { getMensagemLogin, mensagem } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { loginFindByUser } from "../data/login.service";
import { LoginTituloType } from "../type/login";
import { IUser } from "../type/user.model";
import { userFindByRemoteJid } from "../data/user.service";

export default async ({ args, remoteJid, reply, sendText }: IBotData) => {
    let user: IUser | null = await userFindByRemoteJid(remoteJid);
    if (user) {
        let usr: string = StringClean(user.nome);
        if (args) {
            usr = StringClean(args);
        }
        const login: ILogin | null = await loginFindByUser(usr);
        if (login) {
            let msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            return await sendText(true, msg);
        }
        await reply(mensagem('errorLogin'));
    } else {
        await reply(mensagem('errorUser'));
    }
}