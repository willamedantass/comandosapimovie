import { LoginController } from "../controller/loginController";
import { getMensagemLogin, mensagem } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { LoginTituloType } from "../type/login";
import { userFindByRemoteJid } from "../data/user.service";
import { IUser } from "../type/user.model";

export default async ({ sendText, reply, remoteJid, args }: IBotData) => {
    let user: IUser | null = await userFindByRemoteJid(remoteJid);
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

        const res = await LoginController(username, isTrial, isReneew, user);
        if (!res.result) {
            return await reply(res.msg)
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.login);
        await sendText(true, msg);
        user = await userFindByRemoteJid(remoteJid) as IUser;
        await sendText(true, `Seu novo saldo em crédito: ${user.credito}`);
    } else {
        await reply(mensagem('errorUser'));
    }
}