import { loginFindByUser, loginUpdate } from "../data/login.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { userFindByRemoteJid } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { mensagem } from "../util/getMensagem";
import { ILogin } from "../type/login.model";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const login: ILogin | null = await loginFindByUser(StringClean(mData.args));
        if (login) {
            if (login.isLive) {
                login.isLive = false;
                await loginUpdate(login);
                await sendText(mData.remoteJid, "✅ Acesso live removido!", false, mData.id);
            } else {
                login.isLive = true;
                await loginUpdate(login);
                await sendText(mData.remoteJid, "❎ Acesso live liberado!", false, mData.id);
            }
        } else {
            await sendText(mData.remoteJid, 'Usuário informado não existe!', false, mData.id);
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};