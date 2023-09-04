import { LoginController } from '../controller/loginController';
import { getMensagemLogin } from '../util/getMensagem';
import { StringClean } from '../util/stringClean';
import { removerTestes } from '../data/loginDB';
import { IBotData } from '../Interface/IBotData';
import { mensagem } from '../util/jsonConverte';
import { LoginTituloType } from '../type/login';
import { buscarUser } from '../data/userDB';
import { User } from '../type/user';

export default async ({ reply, sendText, remoteJid, args }: IBotData) => {
    let user: User = buscarUser(remoteJid);
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
        removerTestes();
    } else {
        await reply(mensagem('errorUser'));
    }
}
