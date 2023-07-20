import { readJSON, writeJSON } from "../util/jsonConverte";
import { livePass } from "../type/livePass";
import path from "path";
const pathJson = path.join(__dirname, "..", "..", "cache", "live_pass.json");

export const criarLivePass = async (login: livePass) => {
    var arquivo = readJSON(pathJson);
    arquivo.push(login)
    writeJSON(pathJson, arquivo);
}

export const readLivePass = (): livePass[] => {
    return readJSON(pathJson);
}

export const unusedUserLivePass = (isRandom: boolean): livePass | undefined => {
    const users = shuffle(readLivePass());
    let user = users.find(user_live => !user_live.isDelete && user_live.isUsed == false );
    if(user) {
        return user;
    }
    
    if(isRandom){
        user = users.find(user_live => !user_live.isDelete);
    }
    return user;
}

export const searchLivePass = (name: string) => {
    return readLivePass().find(value => value.username === name);
}
export const zerarLivePass = () => {
    const logins: livePass[] = readLivePass().map(login=>{
        return {
            ...login,
            countUsed : 0,
            isUsed: false,
        }
    });
    writeJSON(pathJson, logins);
    console.log('Lista de live logins reiniciado com sucesso.');   
}

export const updateLivePass = async (login: livePass) => {
    const logins = readJSON(pathJson)
    var loginsNew: any[] = []

    logins.forEach(value => {
        if (value.username === login.username) {
            loginsNew.push(login)
        } else {
            loginsNew.push(value)
        }
    });
    writeJSON(pathJson, loginsNew);
}

export const deleteLivePass = async (username: string) => {
    const logins = readJSON(pathJson)
    var loginsNew: any[] = []

    logins.forEach(value => {
        if (value.username !== username) {
            loginsNew.push(value);
        }
    });
    writeJSON(pathJson, loginsNew);
}



export const processTrial = () =>{
    const logins: any[] = [];
    const today = new Date();
    readJSON(pathJson).forEach(login => {
        if(login.isTrial && today > new Date(login.vencimento)){
            login.isDelete = true;
            logins.push(login);
        }else {
            logins.push(login);
        }
    });
    writeJSON(pathJson, logins);
}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}