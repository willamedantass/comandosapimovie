import { IBotData } from '../Interface/IBotData';
import { StringsMsg } from '../util/stringsMsg';
import path from 'path';
import { readJSON, writeJSON } from '../function';

export default async ({ reply, owner, remoteJid }: IBotData) => {
    if (owner) {
        const pathBlackList = path.join(__dirname, '..', '..', 'cache', 'blacklist.json');
        let contato = readJSON(pathBlackList).find(remoJid => remoJid === remoteJid)
        if (!contato) {
            var arquivo = readJSON(pathBlackList)
            arquivo.push(remoteJid)
            writeJSON(pathBlackList, arquivo);
            await reply('Bot desativado para o seu contato!')
        } else {
            var arquivo = readJSON(pathBlackList)
            var index = arquivo.indexOf(remoteJid);
            arquivo.splice(index, 1);
            writeJSON(pathBlackList, arquivo);
            await reply('Bot ativado para o seu contato!')
        }
    } else {
        reply(StringsMsg.acessoNegado);
    }
};