import {  searchUser, updateUser } from "../data/userDB";
import { IBotData } from "../Interface/IBotData";
import { User } from "../type/user";
import { mensagem } from "../util/jsonConverte";

export default async ({ owner, remoteJid, args, reply }: IBotData) => {    
    if (owner) {
        let user: User | undefined = searchUser(remoteJid);
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
        updateUser(user)  
        await reply(mensagem('recarga') + user.credito)      
    } else {
        await reply(mensagem('acessoNegado'));
    }
};