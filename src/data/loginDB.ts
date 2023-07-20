import path from "path";
import { Login } from "../type/login";
import { readJSON, writeJSON } from "../util/jsonConverte";

const pathJson = path.join(__dirname, "..", "..", "cache", "login.json");

export const criarLogin = async (login: Login) => {
    var arquivo = readJSON(pathJson);
    arquivo.push(login)
    writeJSON(pathJson, arquivo);
}

export const readLogins = (user: string) => {
    return readJSON(pathJson);
}

export const buscarLogin = (user: string) => {
    return readJSON(pathJson).find(value => value.user === user);
}

export const updateLogin = async (login: Login) => {
    const logins = readJSON(pathJson)
    var loginsNew: any[] = []

    logins.forEach(value => {
        if (value.user === login.user) {
            loginsNew.push(login)
        } else {
            loginsNew.push(value)
        }
    });
    await writeJSON(pathJson, loginsNew);
}

export const removerTestes = () =>{
    const logins: any[] = [];
    const today = new Date();
    readJSON(pathJson).forEach(login => {
        if(login.isTrial && today > new Date(login.vencimento)){
            return
        }
        logins.push(login);
    });
    writeJSON(pathJson, logins);
}