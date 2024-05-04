import { loginDelete, loginFindByUser } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, args, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        if (args.length < 8) {
            return await reply(mensagem('errorLoginSize'));
        }
        const username = StringClean(args);
        const login = await loginFindByUser(username);
        let msg = 'Login não encontrado.'
        if(login){
            await loginDelete(username);
            msg = 'Login removido com sucesso!'
        }
        await reply(msg);
    } else {
        await reply(mensagem('acessoNegado'));
    }
}