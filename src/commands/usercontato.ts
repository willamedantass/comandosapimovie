import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, args, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const comandos = args.split('@');
        if (comandos.length < 1) {
            return await reply('Infome o usuário e o contato separando por @.')
        }

        let login: ILogin | null = await loginFindByUser(comandos[0].trim());
        if (login) {
            let contato = comandos[1];
            if (contato.startsWith('+55')) {
                contato = contato.replace('+55', '');
            }
            contato = contato.replace(/[\s-]/g, '');
            login.contato = contato;
            login.data_msg_vencimento = '';
            await loginUpdate(login);
            await reply('Login atualizado!');
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'))
    }
}