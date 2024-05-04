import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, args, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const comandos = args.split(' ');
        const login: ILogin | null = await loginFindByUser(comandos[0]);
        if (login) {
            let vencimento = new Date();
            const dias = parseInt(comandos[1]);
            if (dias) {
                vencimento.setDate(vencimento.getDate() + dias);
                vencimento.setHours(23, 59, 59, 998);
                login.vencimento = vencimento.toISOString();
                await loginUpdate(login);
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