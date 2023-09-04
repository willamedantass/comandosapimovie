import { readJSON, writeJSON } from "../util/jsonConverte";
import { Login } from "../type/login";
import path from "path";
const pathJson = path.join(__dirname, "..", "..", "cache", "login.json");

export const criarLogin = (login: Login): void => {
    var arquivo = readJSON(pathJson);
    arquivo.push(login)
    writeJSON(pathJson, arquivo);
}

export const readLogins = (): Login[] => {
    return readJSON(pathJson);
}

export const buscarLogin = (user: string): Login | undefined => {
    return readLogins().find((value: Login) => value.user === user);
}

export const updateLogin = (login: Login): void => {
    const logins = readJSON(pathJson)
    var loginsNew: any[] = []

    logins.forEach(value => {
        if (value.user === login.user) {
            loginsNew.push(login)
        } else {
            loginsNew.push(value)
        }
    });
    writeJSON(pathJson, loginsNew);
}

export const removerTestes = (): void =>{
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