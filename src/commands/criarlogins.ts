
import { createLoginAPI } from "../controller/LoginsWebOPainelController";
import { ConvertWhatsAppEvent } from "../type/WhatsAppEvent";
import { userFindByRemoteJid } from "../data/user.service";
import { mensagem } from "../util/getMensagem";
import { sendText } from "../util/evolution";

export default async (mData: ConvertWhatsAppEvent) => {
  let user = await userFindByRemoteJid(mData.remoteJid);
  if (mData.owner || user?.acesso === 'adm') {
    await criarLoginsComIntervalo(mData)
  } else {
    sendText(mData.remoteJid, mensagem('acessoNegado'), false, mData.id);
  }
}

const criarLoginsComIntervalo = async (mData: ConvertWhatsAppEvent) => {
  let iteracao = 0;
  if (iteracao < 5) {
    const tempoDeEspera = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
    setTimeout(async () => {
      const result = await createLoginAPI();
      result ? await sendText(mData.remoteJid, `Login criado com sucesso!`, false, mData.id) : await sendText(mData.remoteJid, 'Não foi possível criar o login de teste!', false, mData.id);
      iteracao++,
        criarLoginsComIntervalo(mData); // Chama a próxima iteração
    }, tempoDeEspera);
  } else {
    await sendText(mData.remoteJid, 'Processo de criação de logins finalizado!', false, mData.id);
  }
}