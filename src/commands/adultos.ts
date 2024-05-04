import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { loginFindByUser, loginUpdate } from "../data/login.service";
import { ILogin } from "../type/login.model";

export default async ({reply, args}: IBotData) => {   
        const login: ILogin | null = await loginFindByUser(StringClean(args));
        if(login){
            if(login?.isAdult){
                login.isAdult = false;
                await loginUpdate(login);
                await reply("✅ Acesso canais/filmes adultos removido!");
            } else {
                login.isAdult = true;
                await loginUpdate(login);
                await reply("❎ Acesso canais/filmes adultos liberado!");
            }
        } else {
            reply('Usuário informado não existe!')
        }
};