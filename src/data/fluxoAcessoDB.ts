import { processTrial, searchLivePass, updateLivePass } from "../data/livePassDB";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { LivePass } from "../type/livePass";
import path from "path";
const pathJson = path.join(__dirname, "..", "..", "cache", "fluxo_acesso.json");

const dateExpire = (): string => {
    const dataExpirar = new Date();
    dataExpirar.setMinutes(dataExpirar.getMinutes() + 30);
    return dataExpirar.toISOString();
}

const isExpired = (expireDate: string): boolean => {
    const today = new Date();
    const expireDateObj = new Date(expireDate);
    return today > expireDateObj;
}

const updateStatusUserFluxo = (userFluxo: userFluxoAcesso): void => {
    const userLivepass = searchLivePass(userFluxo.login);
    if (userLivepass) {
        if (userLivepass.countUsed > 0) {
            userLivepass.countUsed -= 1;
        }
        userLivepass.isUsed = userLivepass.countUsed !== 0;
        updateLivePass(userLivepass);
    }
}

export const createUserFluxo = (user: string, livePass: LivePass): void => {
    const { username, password } = livePass;
    const users = readUserFluxo();

    const existingLivePass = searchLivePass(username);
    if (existingLivePass) {
        existingLivePass.isUsed = true;
        existingLivePass.countUsed += 1;
        updateLivePass(existingLivePass);

        const newUserFluxo: userFluxoAcesso = {
            user,
            login: username,
            password,
            expire: dateExpire(),
            data: new Date().toISOString()
        };

        users.push(newUserFluxo);
        writeJSON(pathJson, users);
    }
}

export const readUserFluxo = (): userFluxoAcesso[] => {
    return readJSON(pathJson) || [];
}

export const searchUserFluxo = (user: string) => {
    return readUserFluxo().find(value => value.user === user);
}

export const zerarUserFluxo = () => {
    writeJSON(pathJson, []);
    console.log('Lista de fluxo de acesso zerado com sucesso.');
}

export const updateUserFluxo = async (userFluxo: userFluxoAcesso) => {
    const users = readUserFluxo();
    const updatedUsers = users.map(value =>
        value.user === userFluxo.user ? { ...userFluxo, expire: dateExpire(), data: new Date().toISOString()} : value
    );
    writeJSON(pathJson, updatedUsers);
}

export const processUserFluxo = (): void => {
    const usersFluxo: userFluxoAcesso[] = [];
    readUserFluxo().forEach((userFluxo: userFluxoAcesso) => {
        if (isExpired(userFluxo.expire)) {
            updateStatusUserFluxo(userFluxo);
        } else {
            usersFluxo.push(userFluxo);
        }
    });
    writeJSON(pathJson, usersFluxo);
    processTrial();
}