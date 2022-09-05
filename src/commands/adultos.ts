import { buscarLogin, updateLogin } from "../controller/loginDBController";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";

export default async ({reply, args, owner}: IBotData) => {
    if(owner){        
        const login: Login = buscarLogin(StringClean(args));
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
    } else {
        reply(StringsMsg.acessoNegado);
    }
};