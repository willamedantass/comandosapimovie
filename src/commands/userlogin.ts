import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { IUser } from "../type/user.model";
import { mensagem } from "../util/getMensagem";
import { contatoClean } from "../util/contatoToJid";

export default async ({ reply, owner, remoteJid, args }: IBotData) => {
  let user = await userFindByRemoteJid(remoteJid);
  if (owner || user?.acesso === 'adm') {
    const data = args.split('@');
    let login: ILogin | null = await loginFindByUser(StringClean(data[0]));
    const contato = contatoClean(data[1]);
    const jid = `55${contato}@s.whatsapp.net`;
    let user: IUser | null = await userFindByRemoteJid(jid);
    if (login && user) {
      login.uid = user.id;
      login.contato = 
      user.vencimento = login.vencimento;
      await userUpdate(user);
      await loginUpdate(login);
      await reply('Login atualizado!');
    } else {
      await reply(mensagem('errorLogin'));
    }
  } else {
    reply(mensagem('acessoNegado'));
  }
}