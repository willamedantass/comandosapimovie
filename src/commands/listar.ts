import { loginsAll } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";
import { mensagem } from "../util/getMensagem";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
        (await loginsAll()).forEach((element, index) => {
            msg += `${index + 1} - ${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
        });
        await sendText(mData.remoteJid, msg, true);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};