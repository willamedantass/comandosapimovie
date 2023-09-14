import { mensagem, readJSON } from "../util/jsonConverte";
import { IBotData } from "../Interface/IBotData";
import path from "path";

export default async ({ reply, sendText, owner }: IBotData) => {
    if (owner) {
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