import { IUser } from "../type/user.model";
import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { mensagem } from "../util/getMensagem";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        if (isNaN(parseInt(mData.args))) { 
            return await sendText(mData.remoteJid, 'Argumento não é um valor aceito.', false, mData.id);
        }

        let user: IUser | null = await userFindByRemoteJid(mData.remoteJid);
        if (user) {
            user.valor = mData.args.trim();
            await userUpdate(user);
            await sendText(mData.remoteJid, 'Valor de venda atualizado!', false, mData.id);
        } else {
            await sendText(mData.remoteJid, 'Usuário informado não existe!', false, mData.id);
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
}