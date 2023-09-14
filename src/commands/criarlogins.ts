import { createLoginAPI } from "../controller/LoginsWebOPainelController";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";

export default async ({ reply, owner }: IBotData) => {
    if (owner) {
        await criarLoginsComIntervalo(0,reply)
    } else {
        reply(mensagem('acessoNegado'));
    }
}

const criarLoginsComIntervalo = async (iteracao:number,reply:any) => {
    if (iteracao < 5) {
      const tempoDeEspera = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
      setTimeout(async () => {
        const result = await createLoginAPI();
        result ? await reply(`Login criado com sucesso!`) : await reply('Não foi possível criar o login de teste!'); 
        criarLoginsComIntervalo(iteracao+1, reply); // Chama a próxima iteração
      }, tempoDeEspera);
    } else {
      await reply('Processo de criação de logins finalizado!');
    }
  }