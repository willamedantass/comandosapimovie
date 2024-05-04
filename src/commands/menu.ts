import { readJSON } from "../util/jsonConverte";
import { IBotData } from "../Interface/IBotData";
import path from "path";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, sendText, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
        const commands = readJSON(path.join(__dirname, '..', '..', 'cache', 'commands.json'));
        let msg: string = 'Lista de comandos:\n';
        commands.forEach(command => {
            msg += `#${command}\n`
        });
        await sendText(false, msg);
    } else {
        await reply(mensagem('acessoNegado'))
    }
}