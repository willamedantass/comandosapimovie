import { loginFindByUser, loginUpdate } from "../data/login.service";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, args, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const login: ILogin | null = await loginFindByUser(StringClean(args));
        if (login) {
            if (login.isLive) {
                login.isLive = false;
                await loginUpdate(login);
                await reply("✅ Acesso live removido!");
            } else {
                login.isLive = true;
                await loginUpdate(login);
                await reply("❎ Acesso live liberado!");
            }
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'));
    }
};