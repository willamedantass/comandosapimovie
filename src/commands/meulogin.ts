
import { buscarUser, updateUser } from "../data/userDB";
import { getMensagemLogin } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { LoginTituloType } from "../type/login";
import { User } from "../type/user";
import { mensagem } from "../util/jsonConverte";
import { LoginController } from "../controller/loginController";

export default async ({ sendText, reply, remoteJid, args }: IBotData) => {
    let user: User = buscarUser(remoteJid);
    if (user) {
        const isTrial = false;
        const isReneew = false;

        let username = StringClean(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply(mensagem('errorLoginSize'));
            }
            username = StringClean(args);
        }

        const res = LoginController(username, isTrial, isReneew, user);
        if (!res.result) {
            return await reply(res.msg)
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste);
        await sendText(true, msg);
        user = buscarUser(remoteJid);
        await sendText(true, `Seu novo saldo em crédito: ${user.credito}`);
    } else {
        await reply(mensagem('errorUser'));
    }
}