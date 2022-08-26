import { buscarUser, updateUser } from "../controller/userDBController";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Acesso, User } from "../type/user";

export default async ({remoteJid, reply, owner}: IBotData) => {
    if(owner){
        let user: User = buscarUser(remoteJid);
        if(user){
            if(user.acesso === Acesso.usuario){
                user.acesso = Acesso.revenda;
                await updateUser(user);
                await reply("✅ Acesso de revendedor liberado!");
            } else {
                user.acesso = Acesso.usuario;
                await updateUser(user);
                await reply("❎ Acesso de revendedor removido!");
            }
        } else {
            reply(StringsMsg.errorUser)
        }
    } else {
        reply(StringsMsg.acessoNegado);
    }
};