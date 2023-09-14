import { buscarLogin, updateLogin } from "../data/loginDB";
import { IBotData } from "../Interface/IBotData";
import { Login } from "../type/login";
import { mensagem } from "../util/jsonConverte";

export default async ({ reply, args, owner }: IBotData) => {
    if (owner) {
        const comandos = args.split(' ');
        const login: Login | undefined = buscarLogin(comandos[0]);
        if (login) {
            let vencimento = new Date();
            const dias = parseInt(comandos[1]);
            if (dias) {
                vencimento.setDate(vencimento.getDate() + dias);
                vencimento.setHours(23, 59, 59, 998);
                login.vencimento = vencimento.toISOString();
                updateLogin(login);
                const options = { timeZone: 'America/Sao_Paulo', hour12: false }
                return await reply(`✅ Novo vencimento: ${vencimento.toLocaleString('pt-br', options)}.`);
            }
            await reply('Não foi possível fazer o desbloqueio, comando contém erros.');
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'));
    }
};