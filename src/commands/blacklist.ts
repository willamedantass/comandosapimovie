import { readJSON, writeJSON } from '../util/jsonConverte';
import { IBotData } from '../Interface/IBotData';
import path from 'path';
import { userFindByRemoteJid } from '../data/user.service';
import { mensagem } from '../util/getMensagem';

export default async ({ reply, owner, remoteJid }: IBotData) => {
    let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
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
        await reply(mensagem('acessoNegado'));
    }
};