import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { PixController } from "../controller/PixController";
import { getMensagemPix, mensagem } from "../util/getMensagem";
import { IBotData } from "../Interface/IBotData";
import { IUser } from "../type/user.model";

export default async ({ remoteJid, reply, sendText }: IBotData) => {
    const user: IUser | null = await userFindByRemoteJid(remoteJid);
    if (user) {
        const pix_data = await PixController(user);
        if(pix_data.result){
            await reply(getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount));
            await sendText(false,  pix_data?.data.point_of_interaction.transaction_data.qr_code);
            await sendText(false, mensagem('pix'));
            user.data_pix = new Date().toISOString();
            user.limite_pix = user?.limite_pix ? user.limite_pix + 1 : 1;
            await userUpdate(user);
        } else {
            await sendText(true, pix_data.msg);
        }
    }
}
