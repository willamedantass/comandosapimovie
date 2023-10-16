import { LoginController } from "../controller/loginController";
import { searchLoginPorUsername } from "../data/loginDB";
import { getMensagemLogin } from "../util/getMensagem";
import { Login, LoginTituloType } from "../type/login";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { searchUser } from "../data/userDB";
import { User } from "../type/user";

export default async ({ sendText, reply, remoteJid, args }: IBotData) => {
    let user: User | undefined = searchUser(remoteJid);
    if (user) {
        let username = StringClean(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply(mensagem('errorLoginSize'));
            }
            username = StringClean(args);
        }

        let login: Login | undefined = searchLoginPorUsername(username);
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