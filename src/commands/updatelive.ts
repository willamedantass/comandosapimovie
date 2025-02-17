import { updateLoginsApiClubtv } from "../controller/updateLoginsApiClubtv";
import { userFindByRemoteJid } from "../data/user.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";
import { mensagem } from "../util/getMensagem";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        await updateLoginsApiClubtv();
        await sendText(mData.remoteJid, "Comando executado!", false, mData.id);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
}