import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { IBotData } from "../Interface/IBotData";
import { IUser } from "../type/user.model";
import { mensagem } from "../util/getMensagem";

export default async ({remoteJid, reply, owner}: IBotData) => {
    if(owner){
        let user: IUser | null = await userFindByRemoteJid(remoteJid);
        if(user){
            if(user.acesso === 'usuario'){
                user.acesso = 'revenda';
                await userUpdate(user);
                await reply("✅ Acesso de revendedor liberado!");
            } else {
                user.acesso = 'usuario';
                await userUpdate(user);
                await reply("❎ Acesso de revendedor removido!");
            }
        } else {
            await reply(mensagem('errorUser'))
        }
    } else {
        await reply(mensagem('acessoNegado'))
    }
};