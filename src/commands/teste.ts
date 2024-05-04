import { LoginController, loginRemoveAllTrial } from '../controller/loginController';
import { userFindByRemoteJid } from '../data/user.service';
import { getMensagemLogin, mensagem } from '../util/getMensagem';
import { StringClean } from '../util/stringClean';
import { IBotData } from '../Interface/IBotData';
import { LoginTituloType } from '../type/login';

export default async ({ reply, sendText, remoteJid, args }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (user) {
        const isTrial = true;
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
            return await reply(res.msg);
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste)
        await sendText(true, msg);
        await loginRemoveAllTrial();
    } else {
        await reply(mensagem('errorUser'));
    }
}
