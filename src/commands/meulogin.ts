import { LoginController } from "../controller/loginController";
import { getMensagemLogin, mensagem } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { LoginTituloType } from "../type/login";
import { userFindByRemoteJid } from "../data/user.service";
import { IUser } from "../type/user.model";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
    if (user) {
        const isTrial = false;
        const isReneew = false;

        let username = StringClean(user.nome);
        if (mData.args) {
            if (mData.args.length < 8) {
                return await sendText(mData.remoteJid, mensagem('errorLoginSize'), false, mData.id);
            }
            username = StringClean(mData.args);
        }

        const res = await LoginController(username, isTrial, isReneew, user);
        if (!res.result) {
            return await sendText(mData.remoteJid, res.msg, false, mData.id)
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.login);
        await sendText(mData.remoteJid, msg, true);
        user = await userFindByRemoteJid(mData.remoteJid) as IUser;
        await sendText(mData.remoteJid, `Seu novo saldo em crédito: ${user.credito}`, true);
    } else {
        await sendText(mData.remoteJid, mensagem('errorUser'), false, mData.id);
    }
}