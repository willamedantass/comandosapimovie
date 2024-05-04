import { IBotData } from "../Interface/IBotData";
import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { IUser } from "../type/user.model";
import { mensagem } from "../util/getMensagem";

export default async ({ owner, remoteJid, args, reply }: IBotData) => {    
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        let user: IUser | null = await userFindByRemoteJid(remoteJid);
        if (!user) {
            return await reply(mensagem('errorUser'));
        }
        if(!args){
            return await reply(mensagem('errorArgs'));
        }
        let credito: number = parseInt(args);
        if(!credito){
            return await reply(mensagem('errorArgs'));
        }
        user.credito += credito;
        await userUpdate(user);
        await reply(mensagem('recarga') + user.credito)      
    } else {
        await reply(mensagem('acessoNegado'));
    }
};