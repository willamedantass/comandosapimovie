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
        let login: ILogin | null = await loginFindByUser(StringClean(mData.args));
        if (login) {
            login?.remoteIp ? login.remoteIp = "" : login["remoteIp"] = "";
            login?.countForbiddenAccess ? login.countForbiddenAccess = 0 : login["countForbiddenAccess"] = 0;
            login?.dataRemote ? login.dataRemote = "" : login["dataRemote"] = "";
            await loginUpdate(login);
            return await sendText(mData.remoteJid, "Acesso remoto redefinido!", true);
        } else {
            await sendText(mData.remoteJid, mensagem('errorLogin'), false, mData.id);
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
}