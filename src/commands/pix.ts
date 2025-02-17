import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { PixController } from "../controller/PixController";
import { getMensagemPix, mensagem } from "../util/getMensagem";
import { IBotData } from "../Interface/IBotData";
import { IUser } from "../type/user.model";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    const user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
    if (user) {
        const pix_data = await PixController(user);
        if(pix_data.result){
            await sendText(mData.remoteJid, getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount), true);
            await sendText(mData.remoteJid,  pix_data?.data.point_of_interaction.transaction_data.qr_code, false);
            await sendText(mData.remoteJid, mensagem('pix'), false);
            user.data_pix = new Date().toISOString();
            user.limite_pix = user?.limite_pix ? user.limite_pix + 1 : 1;
            await userUpdate(user);
        } else {
            await sendText(mData.remoteJid, pix_data.msg, true);
        }
    }
}
