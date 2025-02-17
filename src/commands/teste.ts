import { LoginController, loginRemoveAllTrial } from '../controller/loginController';
import { userFindByRemoteJid } from '../data/user.service';
import { getMensagemLogin, mensagem } from '../util/getMensagem';
import { StringClean } from '../util/stringClean';
import { LoginTituloType } from '../type/login';
import { ConvertWhatsAppEvent } from '../type/WhatsAppEvent';
import { sendText } from '../util/evolution';

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (user) {
        const isTrial = true;
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
            return await sendText(mData.remoteJid, res.msg, false, mData.id);
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste)
        await sendText(mData.remoteJid, msg, true);
        await loginRemoveAllTrial();
    } else {
        await sendText(mData.remoteJid, mensagem('errorUser'), false, mData.id);
    }
}
