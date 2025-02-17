import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { userFindByRemoteJid } from "../data/user.service";
import { readJSON } from "../util/jsonConverte";
import { mensagem } from "../util/getMensagem";
import { sendText } from "../util/evolution";
import path from "path";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const commands = readJSON(path.join(__dirname, '..', '..', 'cache', 'commands.json'));
        let msg: string = 'Lista de comandos:\n';
        commands.forEach(command => {
            msg += `#${command}\n`
        });
        await sendText(mData.remoteJid, msg, true);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'),false, mData.id);
    }
}