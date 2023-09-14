import { searchUser, updateUser } from "../data/userDB";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { Acesso, User } from "../type/user";

export default async ({remoteJid, reply, owner}: IBotData) => {
    if(owner){
        let user: User | undefined = searchUser(remoteJid);
        if(user){
            if(user.acesso === Acesso.usuario){
                user.acesso = Acesso.revenda;
                updateUser(user);
                await reply("✅ Acesso de revendedor liberado!");
            } else {
                user.acesso = Acesso.usuario;
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