import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { createLoginAPI } from "../controller/LoginsWebOPainelController";

export default async ({ reply, owner }: IBotData) => {
    if (owner) {
        await criarLoginsComIntervalo(0,reply)
        // for(let i = 0; i < 6; i++){
        //     let result: boolean = false;
        //     const tempoDeEspera = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
        //     await setTimeout(async ()=> result = await createLoginAPI(), tempoDeEspera);
            
        // }
    } else {
        reply(StringsMsg.acessoNegado);
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