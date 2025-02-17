import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { IUser } from "../type/user.model";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";
import { mensagem } from "../util/getMensagem";

export default async (mData: ConvertWhatsAppEvent) => {
    if(mData.owner){
        let user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
        if(user){
            if(user.acesso === 'usuario'){
                user.acesso = 'revenda';
                await userUpdate(user);
                await sendText(mData.remoteJid, "✅ Acesso de revendedor liberado!", false, mData.id);
            } else {
                user.acesso = 'usuario';
                await userUpdate(user);
                await sendText(mData.remoteJid, "❎ Acesso de revendedor removido!", false, mData.id);
            }
        } else {
            await sendText(mData.remoteJid, mensagem('errorUser'), false, mData.id)
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id)
    }
};