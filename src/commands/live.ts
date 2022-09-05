import { buscarLogin, updateLogin } from "../controller/loginDBController";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { Login } from "../type/login";

export default async ({reply, args, owner}: IBotData) => {
    if(owner){        
        const login: Login = buscarLogin(StringClean(args));
        if(login){
            if(login.live){
                login.live = false;
                await updateLogin(login);
                await reply("✅ Acesso live removido!");
            } else {
                login.live = true;
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