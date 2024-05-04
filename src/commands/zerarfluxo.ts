import { zerarUserFluxo } from "../data/fluxoAcessoDB";
import { zerarLivePass } from "../data/livePassDB";
import { userFindByRemoteJid } from "../data/user.service";
import { IBotData } from "../Interface/IBotData";

export default async ({ sendText, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') { 
        zerarUserFluxo();
        zerarLivePass();
        await sendText(true, 'Fluxo zerado com sucesso.');
    }
}