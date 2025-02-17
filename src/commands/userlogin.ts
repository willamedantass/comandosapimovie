import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { ILogin } from "../type/login.model";
import { IUser } from "../type/user.model";
import { mensagem } from "../util/getMensagem";
import { contatoClean } from "../util/contatoToJid";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
  let user = await userFindByRemoteJid(mData.remoteJid);
  if (mData.owner || user?.acesso === 'adm') {
    const data = mData.args.split('@');
    let login: ILogin | null = await loginFindByUser(StringClean(data[0]));
    const contato = contatoClean(data[1]);
    const jid = `55${contato}@s.whatsapp.net`;
    let user: IUser | null = await userFindByRemoteJid(jid);
    if (login && user && contato) {
      login.uid = user.id;
      login.contato = contato;
      user.vencimento = login.vencimento;
      await userUpdate(user);
      await loginUpdate(login);
      await sendText(mData.remoteJid, 'Login atualizado!', false, mData.id);
    } else {
      await sendText(mData.remoteJid, mensagem('errorLogin'), false, mData.id);
    }
  } else {
    sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
  }
}