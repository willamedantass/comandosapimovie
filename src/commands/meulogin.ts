import { createLoginController } from "../controller/createLoginController";
import { buscarUser, updateUser } from "../controller/userDBController";
import { getMensagemLogin } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { LoginTituloType } from "../type/login";
import { StringsMsg } from "../util/stringsMsg";
import { User } from "../type/user";

export default async ({ sendText, reply, remoteJid, args }: IBotData) => {
    let user: User = buscarUser(remoteJid);
    if (user) {
        let credito: number = user.credito ? user.credito : 0;
        if (credito <= 0) {
            return reply(StringsMsg.errorSaldo);
        }
        let userLogin = StringClean(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply(StringsMsg.errorLoginSize);
            }
            userLogin = StringClean(args);
        }

        const isTrial = false;
        const isLive = true;
        const res = await createLoginController(userLogin, isTrial, isLive);
        if (!res['result']) {
            return await reply(res['msg']);
        }
        const msg: string = getMensagemLogin(res['login'].user, res['login'].password, res['login'].vencimento, LoginTituloType.login);
        if (!user?.logins) {
            user.logins = [];
        }
        user.logins.push(res['login'].uid);
        user.credito -= 1;
        updateUser(user);
        await sendText(true, msg);
        await sendText(true,`Seu novo saldo em crédito: ${user.credito}`);
    } else {
        await reply(StringsMsg.errorUser);
    }
}