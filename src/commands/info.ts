import { getMensagemLogin, mensagem } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { ILogin } from "../type/login.model";
import { loginFindByUser } from "../data/login.service";
import { LoginTituloType } from "../type/login";
import { IUser } from "../type/user.model";
import { userFindByRemoteJid } from "../data/user.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
    if (user) {
        let usr: string = StringClean(user.nome);
        if (mData.args) {
            usr = StringClean(mData.args);
        }
        const login: ILogin | null = await loginFindByUser(usr);
        if (login) {
            let msg: string = getMensagemLogin(login.user, login.password, login.vencimento, LoginTituloType.info);
            return await sendText(mData.remoteJid, msg, true);
        }
        await sendText(mData.remoteJid, mensagem('errorLogin'), false, mData.id);
    } else {
        await sendText(mData.remoteJid, mensagem('errorUser'), false, mData.id);
    }
}