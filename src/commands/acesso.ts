import { searchUser, updateUser } from "../data/userDB";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { User } from "../type/user";

export default async ({remoteJid, reply, owner}: IBotData) => {
    if(owner){
        let user: User | undefined = searchUser(remoteJid);
        if(user){
            if(user.acesso === 'usuario'){
                user.acesso = 'revenda';
                updateUser(user);
                await reply("✅ Acesso de revendedor liberado!");
            } else {
                user.acesso = 'usuario';
                updateUser(user);
                await reply("❎ Acesso de revendedor removido!");
            }
        } else {
            await reply(mensagem('errorUser'))
        }
    } else {
        await reply(mensagem('acessoNegado'))
    }
};