import { updateLoginsApiClubtv } from "../controller/updateLoginsApiClubtv";
import { userFindByRemoteJid } from "../data/user.service";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, remoteJid, owner }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        await updateLoginsApiClubtv();
        await reply("Comando executado!");
    } else {
        await reply(mensagem('acessoNegado'));
    }
}