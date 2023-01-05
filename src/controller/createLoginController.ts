import { buscarLogin, criarLogin } from "./loginDBController";
import { Login } from "../type/login";
import { getRandomString } from "../util/getRandomString";
import { uid } from "uid";
import { createLoginWebKOfficeController } from "./createLoginWebKOfficeController";

export const createLoginController = async (userLogin: string, isTrial: boolean, isLive: boolean) => {
    
    let dataVencimento = new Date();
    if(isTrial){
        dataVencimento.setHours(dataVencimento.getHours() + 4);
    } else{
        dataVencimento.setDate(dataVencimento.getDate() + 30);
        dataVencimento.setHours(23, 59, 59, 998);
    }

    let login = buscarLogin(userLogin);
    if(login){
        return {result: false, msg: 'Erro ao criar seu login, o nome de usuário já existe.' };        
    } 
    
    const isLogar = true;
    let result = {result: true, msg: '', user: userLogin, pass: getRandomString() }
    if(isLive && isTrial){
        result = await createLoginWebKOfficeController(isLogar);
    }    

    if (result['result'] == false) {
        console.log(`Erro ao gerar teste para cliente. Mensagem: ${result['msg']}`);
        return result;
    }

    let loginNew : Login = {
        id : result['id'],
        uid : uid(8),
        user : result['user'] || userLogin,
        password :  result['pass'] || getRandomString(),
        dataCadastro: new Date().toISOString(),
        vencimento : dataVencimento.toISOString(),
        live : isLive,
        isTrial: isTrial
    }
    criarLogin(loginNew);
    return {result: true, login: loginNew};
}