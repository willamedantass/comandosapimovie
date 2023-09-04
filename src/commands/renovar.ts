import { buscarLogin, updateLogin } from "../data/loginDB";
import { buscarUser, updateUser } from "../data/userDB";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";
import { User } from "../type/user";
import { mensagem } from "../util/jsonConverte";
import { LoginController } from "../controller/loginController";

export default async ({ sendText, reply, remoteJid, args, owner }: IBotData) => {
    let user: User = buscarUser(remoteJid);
    if (user || owner) {
        let username = StringClean(user.nome);
        if (args) {
            if (args.length < 8) {
                return await reply(mensagem('errorLoginSize'));
            }
            username = StringClean(args);
        }

        let login: Login | undefined = buscarLogin(username);
        if (login) {
            const isTrial = false;
            const isReneew = true;
            const res = LoginController(username, isTrial, isReneew, user);
            if(!res.result){
                return await reply(res.msg);
            }
            const options = { timeZone: 'America/Sao_Paulo', hour12: false }
            let msg = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n          📺 *MOVNOW* 📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n \n';
            msg += `Usuário *${login.user}* renovado com sucesso!\nNovo vencimento: ${new Date(res.data.vencimento).toLocaleString('pt-br', options)}`;
            user = buscarUser(remoteJid);
            await sendText(true, msg);
            return await sendText(true,`Seu novo saldo em crédito: ${user.credito}`);
        } else {
            reply(StringsMsg.errorLogin);
        }
    } else {
        await reply(StringsMsg.errorUser);
    }
}