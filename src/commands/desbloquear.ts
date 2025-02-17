import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { ILogin } from "../type/login.model";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";
import { mensagem } from "../util/getMensagem";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const comandos = mData.args.split(' ');
        const login: ILogin | null = await loginFindByUser(comandos[0]);
        if (login) {
            let vencimento = new Date();
            const dias = parseInt(comandos[1]);
            if (dias) {
                vencimento.setDate(vencimento.getDate() + dias);
                vencimento.setHours(23, 59, 59, 998);
                login.vencimento = vencimento.toISOString();
                await loginUpdate(login);
                const options = { timeZone: 'America/Sao_Paulo', hour12: false }
                return await sendText(mData.remoteJid, `✅ Novo vencimento: ${vencimento.toLocaleString('pt-br', options)}.`, false, mData.id);
            }
            await sendText(mData.remoteJid, 'Não foi possível fazer o desbloqueio, comando contém erros.', false, mData.id);
        } else {
            await sendText(mData.remoteJid, 'Usuário informado não existe!', false, mData.id);
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};