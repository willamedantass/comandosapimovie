import {  searchLoginPorUsername, updateLogin } from "../data/loginDB";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { Login } from "../type/login";

export default async ({reply, args}: IBotData) => {   
        const login: Login | undefined = searchLoginPorUsername(StringClean(args));
        if(login){
            if(login?.isAdult){
                login.isAdult = false;
                await updateLogin(login);
                await reply("✅ Acesso canais/filmes adultos removido!");
            } else {
                login.isAdult = true;
                await updateLogin(login);
                await reply("❎ Acesso canais/filmes adultos liberado!");
            }
        } else {
            reply('Usuário informado não existe!')
        }
};