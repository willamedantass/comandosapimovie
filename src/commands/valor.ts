import { searchUser, updateUser } from "../data/userDB";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { User } from "../type/user";

export default async ({ reply, remoteJid,  args, owner }: IBotData) => {
    if (owner) {
        if (isNaN(parseInt(args))) { 
            return await reply('Argumento não é um valor aceito.')
        }
        let user: User | undefined = searchUser(remoteJid);
        if (user) {
            user.valor = args.trim();
            await updateUser(user)
            await reply('Valor de venda atualizado!');
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'))
    }
}