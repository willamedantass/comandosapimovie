import { createLoginController } from '../controller/createLoginController';
import { buscarUser, updateUser } from '../data/userDB';
import { removerTestes } from '../data/loginDB';
import { getMensagemLogin } from '../util/getMensagem';
import { IBotData } from '../Interface/IBotData';
import { LoginTituloType } from '../type/login';
import { StringsMsg } from '../util/stringsMsg';
import { Acesso, User } from '../type/user';
import { isCriarTeste } from '../function';


export default async ({ reply, sendText, remoteJid, owner }: IBotData) => {
    let user : User = buscarUser(remoteJid);
    if (user) {
        if (isCriarTeste(user?.dataTeste || '') || user.acesso === Acesso.revenda || owner) {
            const isTrial = true;
            const isLive = true;
            const res = await createLoginController(user.nome, isTrial, isLive);
            if(!res['result']){
                return await reply(res['msg'] || '');
            }
            const msg : string = getMensagemLogin(res['login'].user, res['login'].password, res['login'].vencimento, LoginTituloType.teste)
            await sendText(true, msg);
            user.dataTeste = new Date().toISOString();
            updateUser(user);
            removerTestes();
        } else {
            await reply(StringsMsg.limite);
        }
    } else {
        await reply(StringsMsg.errorUser);
    }
};
