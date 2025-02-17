import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { IUser } from "../type/user.model";
import { sendText } from "../util/evolution";
import { mensagem } from "../util/getMensagem";

export default async (mData: ConvertWhatsAppEvent) => {    
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        let user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
        if (!user) {
            return await sendText(mData.remoteJid, mensagem('errorUser'), false, mData.id);
        }
        if(!mData.args){
            return await sendText(mData.remoteJid, mensagem('errorArgs'), false, mData.id);
        }
        let credito: number = parseInt(mData.args);
        if(!credito){
            return await sendText(mData.remoteJid, mensagem('errorArgs'), false, mData.id);
        }
        user.credito += credito;
        await userUpdate(user);
        await sendText(mData.remoteJid, mensagem('recarga') + user.credito, false, mData.id)  
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};