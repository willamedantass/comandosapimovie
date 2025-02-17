import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { readUserFluxo } from "../data/fluxoAcessoDB";
import { IBotData } from "../Interface/IBotData";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const today = new Date();
        today.setMinutes(today.getMinutes() - 5);
        const users: userFluxoAcesso[] = readUserFluxo();
        let online: string = '';

        users.forEach(user => {
            if (new Date(user.data) > today) {
                online += (`\n${user.user.toUpperCase()}`);
            }
        });
        return await sendText(mData.remoteJid, `**Clientes Online** ${online}`, false, mData.id);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};