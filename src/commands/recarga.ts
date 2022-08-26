import { buscarUser, updateUser } from "../controller/userDBController";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { User } from "../type/user";

export default async ({ owner, remoteJid, args, reply }: IBotData) => {    
    if (owner) {
        let user: User = buscarUser(remoteJid);
        if (!user) {
            reply(StringsMsg.errorUser)
            return
        }
        if(!args){
            reply(StringsMsg.errorArgs)
            return
        }
        let credito: number = parseInt(args);
        if(!credito){
            reply(StringsMsg.errorArgs)
            return
        }
        user.credito += credito;
        await updateUser(user)  
        await reply(StringsMsg.recarga + user.credito)      
    } else {
        reply(StringsMsg.acessoNegado);
    }
};