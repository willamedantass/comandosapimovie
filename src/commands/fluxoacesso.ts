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
        const users: userFluxoAcesso[] = readUserFluxo();
        let online: string = '';
        const options = { timeZone: 'America/Sao_Paulo', hour12: false }

        if (!users.length) {
            return await sendText(mData.remoteJid, 'Nenhum usuário conectado.', false, mData.id);
        }

        users.forEach(user => {
            online += (`\n
            ${user.user.toUpperCase()} - 
            Acesso: ${new Date(user.data).toLocaleString('pt-br', options)}`);
        });

        await sendText(mData.remoteJid, `   **Clientes Online** ${online}`, true);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};