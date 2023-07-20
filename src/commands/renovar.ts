import { buscarLogin, updateLogin } from "../data/loginDB";
import { buscarUser, updateUser } from "../data/userDB";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";
import { User } from "../type/user";

export default async ({ sendText, reply, remoteJid, args, owner }: IBotData) => {
    const user: User = buscarUser(remoteJid);
    if (user || owner) {
        let credito: number = owner ? 1 : user.credito;
        if (credito <= 0) {
            return reply(StringsMsg.errorSaldo);
        }

        let usrLogin = user.nome;
        if (args) {
            if (args.length < 8) {
                return await reply(StringsMsg.errorLoginSize);
            }
            usrLogin = StringClean(args);
        }


        let login: Login = buscarLogin(usrLogin);
        if (login) {
            const agora = new Date();
            let vencimento = new Date(login.vencimento);
            if (agora > vencimento) {
                vencimento.setFullYear(agora.getFullYear(), agora.getMonth(), agora.getDate());
                vencimento.setDate(vencimento.getDate() + 30);
            } else {
                vencimento.setDate(vencimento.getDate() + 30);
            }

            login.vencimento = vencimento.toISOString();
            updateLogin(login);
            const options = { timeZone: 'America/Sao_Paulo', hour12: false }
            let msg = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n          📺 *MOVNOW* 📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n \n';
            msg += `Usuário ${login.user} renovado com sucesso! Novo vencimento: ${vencimento.toLocaleString('pt-br', options)}`;
            user.credito -= 1;
            updateUser(user);
            await sendText(true, msg);
            return await sendText(true,`Seu novo saldo em crédito: ${user.credito}`);
        }
        reply(StringsMsg.errorLogin);
    } else {
        await reply(StringsMsg.errorUser);
    }
}