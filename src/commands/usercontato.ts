import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userAddNew, userFindByRemoteJid } from "../data/user.service";
import { IUser, UserModel } from "../type/user.model";
import { contatoClean } from "../util/contatoToJid";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/getMensagem";
import { ILogin } from "../type/login.model";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

const registerNewUser = async (remoteJid: string, vencimento: string): Promise<IUser> => {
    const agora = new Date().toISOString();
    const nome = 'Cinefolis';
    const user = new UserModel({
        nome: nome,
        remoteJid: remoteJid,
        vencimento: vencimento,
        data_cadastro: agora,
        isCadastrando: true,
        acesso: 'usuario',
        pgtos_id: [],
        limite_pix: 0,
        data_pix: agora,
        credito: 0
    });
    await userAddNew(user);
    return user;
}

export default async (mData: ConvertWhatsAppEvent) => {
    let user = await userFindByRemoteJid(mData.remoteJid);
    if (mData.owner || user?.acesso === 'adm') {
        const comandos = mData.args.split('@');
        if (comandos.length < 1) {
            return await sendText(mData.remoteJid, 'Infome o usuário e o contato separando por @.', false, mData.id);
        }

        let login: ILogin | null = await loginFindByUser(comandos[0].trim());
        const contato = contatoClean(comandos[1]);
        
        if (login && contato) {
            const jid = `55${contato}@s.whatsapp.net`;
            let userContato = await userFindByRemoteJid(jid);
            if(!userContato) userContato = await registerNewUser(jid, login.vencimento);
            login.uid = userContato.id;
            login.contato = contato;
            login.data_msg_vencimento = '';
            await loginUpdate(login);
            await sendText(mData.remoteJid, 'Login atualizado!', false, mData.id);
        } else {
            await sendText(mData.remoteJid, 'Usuário informado não existe!', false, mData.id)
        }
    } else {
        await sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
    }
}