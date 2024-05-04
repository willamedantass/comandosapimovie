import { IBotData } from "../Interface/IBotData";
import { IUser } from "../type/user.model";
import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, remoteJid,  args, owner }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        if (isNaN(parseInt(args))) { 
            return await reply('Argumento não é um valor aceito.')
        }

        let user: IUser | null = await userFindByRemoteJid(remoteJid);
        if (user) {
            user.valor = args.trim();
            await userUpdate(user);
            await reply('Valor de venda atualizado!');
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'))
    }
}