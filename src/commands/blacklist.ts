import { readJSON, writeJSON } from '../util/jsonConverte';
import path from 'path';
import { userFindByRemoteJid } from '../data/user.service';
import { mensagem } from '../util/getMensagem';
import { ConvertWhatsAppEvent } from '../type/WhatsAppEvent';
import { sendText } from '../util/evolution';

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const pathBlackList = path.join(__dirname, '..', '..', 'cache', 'blacklist.json');
        let contato = readJSON(pathBlackList).find(remoJid => remoJid === mData.remoteJid)
        if (!contato) {
            var arquivo = readJSON(pathBlackList)
            arquivo.push(mData.remoteJid)
            writeJSON(pathBlackList, arquivo);
            await sendText(mData.remoteJid, 'Bot desativado para o seu contato!', false, mData.id);
        } else {
            var arquivo = readJSON(pathBlackList)
            var index = arquivo.indexOf(mData.remoteJid);
            arquivo.splice(index, 1);
            writeJSON(pathBlackList, arquivo);
            await sendText(mData.remoteJid, 'Bot ativado para o seu contato!', false, mData.id);
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
};