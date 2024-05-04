import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/getMensagem";
import { ILogin } from "../type/login.model";

export default async ({ args, reply, sendText, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        let login: ILogin | null = await loginFindByUser(StringClean(args));
        if (login) {
            login?.remoteIp ? login.remoteIp = "" : login["remoteIp"] = "";
            login?.countForbiddenAccess ? login.countForbiddenAccess = 0 : login["countForbiddenAccess"] = 0;
            login?.dataRemote ? login.dataRemote = "" : login["dataRemote"] = "";
            await loginUpdate(login);
            return await sendText(true, "Acesso remoto redefinido!");
        } else {
            await reply(mensagem('errorLogin'));
        }
    } else {
        await reply(mensagem('acessoNegado'));
    }
}