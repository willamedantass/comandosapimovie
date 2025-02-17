import { loginsAll } from "../data/login.service";
import { ILogin } from "../type/login.model";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        const hoje = new Date();
        let logins: ILogin[] = await loginsAll();
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'
        logins.forEach((element, _) => {
            if (new Date(element.vencimento) < hoje) {
                msg += `${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
            }
        });
        await sendText(mData.remoteJid, msg, true);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};