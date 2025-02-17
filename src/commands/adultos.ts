import { loginFindByUser, loginUpdate } from "../data/login.service";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { StringClean } from "../util/stringClean";
import { ILogin } from "../type/login.model";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    const login: ILogin | null = await loginFindByUser(StringClean(mData.args));
    if (login) {
        if (login?.isAdult) {
            login.isAdult = false;
            await loginUpdate(login);
            await sendText(mData.remoteJid, "✅ Acesso canais/filmes adultos removido!", false, mData.id);
        } else {
            login.isAdult = true;
            await loginUpdate(login);
            await sendText(mData.remoteJid, "❎ Acesso canais/filmes adultos liberado!", false, mData.id);
        }
    } else {
        sendText(mData.remoteJid, 'Usuário informado não existe!', false, mData.id)
    }
};