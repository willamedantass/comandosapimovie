import { buscarLogin, updateLogin } from "../data/loginDB";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";

export default async ({ reply, args, owner }: IBotData) => {
    if (owner) {
        const comandos = args.split(' ');
        const login: Login = buscarLogin(comandos[0]);
        if (login) {
            let vencimento = new Date();
            const dias = parseInt(comandos[1]);
            if (dias) {
                vencimento.setDate(vencimento.getDate() + dias);
                vencimento.setHours(23, 59, 59, 998);
                login.vencimento = vencimento.toISOString();
                await updateLogin(login);
                const options = { timeZone: 'America/Sao_Paulo', hour12: false }
                return await reply(`✅ Novo vencimento: ${vencimento.toLocaleString('pt-br', options)}.`);
            }
            return await reply('Não foi possível fazer o desbloqueio, comando contém erros.');
        } else {
            reply('Usuário informado não existe!')
        }
    } else {
        reply(StringsMsg.acessoNegado);
    }
};