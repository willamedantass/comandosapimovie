import { LoginController } from "../controller/loginController";
import { getMensagemLogin, mensagem } from "../util/getMensagem";
import { LoginTituloType } from "../type/login";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { loginFindByUser } from "../data/login.service";
import { IUser } from "../type/user.model";
import { userFindByRemoteJid } from "../data/user.service";

export default async ({ sendText, reply, remoteJid, args }: IBotData) => {
    let user: IUser | null = await userFindByRemoteJid(remoteJid);
    if (user) {
        let username = StringClean(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply(mensagem('errorLoginSize'));
            }
            username = StringClean(args);
        }

        let login = await loginFindByUser(username);
        if (login) {
            const isTrial = false;
            const isReneew = true;
            const res = await LoginController(username, isTrial, isReneew, user);
            if (!res.result) {
                return await reply(res.msg);
            }

            const msg = getMensagemLogin(login.user, '', res.data.vencimento, LoginTituloType.renovacao);
            await sendText(true, msg);
            await sendText(true, res.msg);
        } else {
            await reply(mensagem('errorLogin'));
        }
    } else {
        await reply(mensagem('errorUser'));
    }
}