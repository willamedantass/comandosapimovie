import { zerarUserFluxo } from "../data/fluxoAcessoDB";
import { zerarLivePass } from "../data/livePassDB";
import { userFindByRemoteJid } from "../data/user.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') { 
        zerarUserFluxo();
        zerarLivePass();
        await sendText(mData.remoteJid, 'Fluxo zerado com sucesso.', true);
    }
}