import { LoginController } from "../controller/loginController";
import { getMensagemLogin, mensagem } from "../util/getMensagem";
import { LoginTituloType } from "../type/login";
import { StringClean } from "../util/stringClean";
import { loginFindByUser } from "../data/login.service";
import { IUser } from "../type/user.model";
import { userFindByRemoteJid } from "../data/user.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
    if (user) {
        let username = StringClean(user.nome);
        if (mData.args) {
            if (mData.args.length < 8) {
                return await sendText(mData.remoteJid, mensagem('errorLoginSize'), false, mData.id);
            }
            username = StringClean(mData.args);
        }

        let login = await loginFindByUser(username);
        if (login) {
            const isTrial = false;
            const isReneew = true;
            const res = await LoginController(username, isTrial, isReneew, user);
            if (!res.result) {
                return await sendText(mData.remoteJid, res.msg, false, mData.id);
            }

            const msg = getMensagemLogin(login.user, '', res.data.vencimento, LoginTituloType.renovacao);
            await sendText(mData.remoteJid, msg, true);
            await sendText(mData.remoteJid, res.msg, false);
        } else {
            await sendText(mData.remoteJid, mensagem('errorLogin'), false, mData.id);
        }
    } else {
        await sendText(mData.remoteJid, mensagem('errorUser'), false, mData.id);
    }
}