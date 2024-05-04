import { loginFindByUser, loginUpdate } from "../data/login.service";
import { userFindByRemoteJid, userUpdate } from "../data/user.service";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { IUser } from "../type/user.model";
import { mensagem } from "../util/getMensagem";

export default async ({ reply, owner, remoteJid, args }: IBotData) => {
  let user = await userFindByRemoteJid(remoteJid);
    if (owner || user?.acesso === 'adm') {
    let login: ILogin | null = await loginFindByUser(StringClean(args));
    let user: IUser | null = await userFindByRemoteJid(remoteJid);
    if (login && user) {
      login.uid = user.id;
      login.contato = remoteJid.replace('55', '').split('@')[0];
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