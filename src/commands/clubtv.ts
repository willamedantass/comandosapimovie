import { StringClean } from "../util/stringClean";
import { ILogin } from "../type/login.model";
import { loginFindByUser, loginUpdate } from "../data/login.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    const login: ILogin | null = await loginFindByUser(StringClean(mData.args));
    if (login) {
        if (login?.isClubtv) {
            login.isClubtv = false;
            await loginUpdate(login);
            await sendText(mData.remoteJid, "✅ Acesso aos canais clubtv removido!", false, mData.id);
        } else {
            login.isClubtv = true;
            await loginUpdate(login);
            await sendText(mData.remoteJid, "❎ Acesso aos canais clubtv liberado!", false, mData.id);
        }
    } else {
        sendText(mData.remoteJid, 'Usuário informado não existe!', false, mData.id);
    }
};