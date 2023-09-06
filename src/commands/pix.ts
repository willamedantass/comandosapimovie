import { PixController } from "../controller/PixController";
import { searchUser, updateUser } from "../data/userDB";
import { getMensagemPix } from "../util/getMensagem";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { User } from "../type/user";

export default async ({ remoteJid, reply, sendText }: IBotData) => {
    const user: User | undefined = searchUser(remoteJid);
    if (user) {
        const pix_data = await PixController(user);
        if(pix_data.result){
            await reply(getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount));
            await sendText(false,  pix_data?.data.point_of_interaction.transaction_data.qr_code);
            await sendText(false, mensagem('pix'));
            user.data_pix = new Date().toISOString();
            updateUser(user);
        } else {
            await sendText(true, pix_data.msg);
        }
    }
}
