import { searchLoginPorUsername, updateLogin } from "../data/loginDB";
import { searchUser, updateUser } from "../data/userDB";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";

export default async ({ reply, owner, remoteJid, args }: IBotData) => {
  if (owner) {
    let login = searchLoginPorUsername(args);
    const user = searchUser(remoteJid);
    if (login && user) {
      login.uid = user.id;
      login.contato = remoteJid.replace('55', '').split('@')[0];
      user.vencimento = login.vencimento;
      await updateUser(user);
      await updateLogin(login);
      await reply('Login atualizado!');
    } else {
      await reply(mensagem('errorLogin'));
    }
  } else {
    reply(mensagem('acessoNegado'));
  }
}