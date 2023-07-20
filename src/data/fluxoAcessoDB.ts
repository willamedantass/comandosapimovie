import { processTrial, searchLivePass, updateLivePass } from "../data/livePassDB";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { livePass } from "../type/livePass";
import path from "path";
const pathJson = path.join(__dirname, "..", "..", "cache", "fluxo_acesso.json");

export const createUserFluxo = async (user_acesso: userFluxoAcesso) => {
    var arquivo = readJSON(pathJson);
    let user_livepass: livePass | undefined = searchLivePass(user_acesso.login);
    if(user_livepass){
        user_livepass['isUsed'] = true;
        user_livepass['countUsed'] += 1;
        arquivo.push(user_acesso)
        updateLivePass(user_livepass);
        writeJSON(pathJson, arquivo);
    }
}

export const readUserFluxo = (): userFluxoAcesso[] => {
    return readJSON(pathJson) || [];
}

export const searchUserFluxo = (user: string) => {
    return readJSON(pathJson).find(value => value.user === user);
}

export const zerarUserFluxo = () => {
    writeJSON(pathJson, []);
    console.log('Lista de fluxo de acesso zerado com sucesso.');   
}

export const updateUserFluxo = async (userFluxo: userFluxoAcesso) => {
    const users = readJSON(pathJson)
    const usersNew: any[] = []
    userFluxo['data'] = new Date().toISOString();

    users.forEach(value => {
        if (value.user === userFluxo.user) {
            usersNew.push(userFluxo);
        } else {
            usersNew.push(value);
        }
    });
    writeJSON(pathJson, usersNew);
}

export const processUserFluxo = () => {
    const users: any[] = [];
    const today = new Date();

    readJSON(pathJson).forEach(userFluxo => {
        if (today > new Date(userFluxo.expire)) {
            let user_livepass: livePass | undefined = searchLivePass(userFluxo.login);
            if(user_livepass){
                user_livepass.countUsed > 0 ? user_livepass.countUsed -= 1 : 0;
                user_livepass.countUsed == 0 ? user_livepass.isUsed = false : user_livepass.isUsed = true;
                updateLivePass(user_livepass);
            }
        } else {
            users.push(userFluxo);
        }
    });
    writeJSON(pathJson, users);
    processTrial();
}