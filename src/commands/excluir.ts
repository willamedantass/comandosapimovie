import { loginDelete, loginFindByUser } from "../data/login.service";
import { userFindByRemoteJid } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { mensagem } from "../util/getMensagem";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        if (mData.args.length < 8) {
            return await sendText(mData.remoteJid, mensagem('errorLoginSize'), false, mData.id);
        }
        const username = StringClean(mData.args);
        const login = await loginFindByUser(username);
        let msg = 'Login não encontrado.'
        if(login){
            await loginDelete(username);
            msg = 'Login removido com sucesso!'
        }
        await sendText(mData.remoteJid, msg, false, mData.id);
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
}