import { searchLoginPorUsername, updateLogin } from "../data/loginDB";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { Login } from "../type/login";

export default async ({ reply, args, owner }: IBotData) => {
    if (owner) {
        const comandos = args.split('@');
        if (comandos.length < 1) {
            return await reply('Infome o usuário e o contato separando por @.')
        }
        let login: Login | undefined = searchLoginPorUsername(comandos[0].trim());
        if (login) {
            let contato = comandos[1];
            if (contato.startsWith('+55')) {
                contato = contato.replace('+55', '');
            }
            contato = contato.replace(/[\s-]/g, '');
            login.contato = contato;
            login.data_msg_vencimento = '';
            updateLogin(login);
            await reply('Login atualizado!');
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'))
    }
}