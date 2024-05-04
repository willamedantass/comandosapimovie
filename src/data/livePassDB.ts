import { readJSON, writeJSON } from "../util/jsonConverte";
import { LivePass } from "../type/livePass";
import path from "path";
const pathJson = path.join(__dirname, "..", "..", "cache", "live_pass.json");

export const addLivePass = (login: LivePass) => {
    var arquivo = readJSON(pathJson);
    arquivo.push(login)
    writeJSON(pathJson, arquivo);
}

export const readLivePass = (): LivePass[] => {
    return readJSON(pathJson);
}

export const unusedUserLivePass = (isRandom: boolean): LivePass | undefined => {
    const users = shuffle(readLivePass()) as LivePass[];
    let user = users.find(userLive => !userLive.isDelete && userLive.isUsed === false); //&& (new Date(userLive.vencimento) > new Date())
    if (user) {
        return user;
    }
    if (isRandom) {
        user = users.find(userLive => !userLive.isDelete);
    }
    return user;
}

export const searchLivePass = (username: string) => {
    return readLivePass().find(value => value.username === username);
}

export const zerarLivePass = () => {
    const logins: LivePass[] = readLivePass().map(login => {
        return {
            ...login,
            countUsed: 0,
            isUsed: false,
        }
    });
    writeJSON(pathJson, logins);
    console.log('Lista de logins reiniciado com sucesso.');
}

export const updateLivePass = (updatedLogin: LivePass) => {
    const logins = readLivePass();
    const updatedLogins = logins.map((login) =>
        login.username === updatedLogin.username ? updatedLogin : login
    );
    writeJSON(pathJson, updatedLogins);
}

export const deleteLivePass = (username: string) => {
    const logins = readLivePass();
    const updatedLogins = logins.filter((login) => login.username !== username);
    writeJSON(pathJson, updatedLogins);
}

export const processTrial = () => {
    const today = new Date();
    const updatedLogins = readLivePass().map(login =>
        (login.isTrial && today > new Date(login.vencimento))
            ? { ...login, isDelete: true }
            : login
    );
    writeJSON(pathJson, updatedLogins);
}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}