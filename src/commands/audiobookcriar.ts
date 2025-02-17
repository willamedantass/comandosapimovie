import { createLoginAudioBooksController } from "../controller/createLoginAudioBooksController";
import { getMensagemAudioBooks } from "../util/getMensagemAudioBooks";
import { userFindByRemoteJid } from "../data/user.service";
import { contatoClean } from "../util/contatoToJid";
import { LoginTituloType } from "../type/login";
import { mensagem } from "../util/getMensagem";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {

        const user = mData.args.split('@');
        if (user.length < 1) {
            return await sendText(mData.remoteJid, 'Infome o usuário e o contato separando por @.', false, mData.id);
        }

        const username = user[0];
        const contato = contatoClean(user[1]);
        
        const agora = new Date();
        let vencimento = new Date();

        vencimento = new Date()
        vencimento.setDate(agora.getDate() + 30);
        vencimento.setHours(23, 59, 59, 998);

        if (username && contato) {
            const info = {
                contato,
                vencimento
            }

            const jsonString = JSON.stringify(info);
            const result = await createLoginAudioBooksController(username, jsonString);
            if(result.result){
                await sendText(mData.remoteJid, getMensagemAudioBooks(result.data.username, result.data.password, vencimento, LoginTituloType.login), true);
            } else {
                await sendText(mData.remoteJid, 'Erro ao criar login: '+ result.msg, false, mData.id);
            }
        }
    } else {
        sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
}