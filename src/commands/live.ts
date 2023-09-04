import { buscarLogin, updateLogin } from "../data/loginDB";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";

export default async ({reply, args, owner}: IBotData) => {
    if(owner){        
        const login: Login | undefined= buscarLogin(StringClean(args));
        if(login){
            if(login.isLive){
                login.isLive = false;
                await updateLogin(login);
                await reply("✅ Acesso live removido!");
            } else {
                login.isLive = true;
                await updateLogin(login);
                await reply("❎ Acesso live liberado!");
            }
        } else {
            reply('Usuário informado não existe!')
        }
    } else {
        reply(StringsMsg.acessoNegado);
    }
};