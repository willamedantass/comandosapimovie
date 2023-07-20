import path from "path";
import { User } from "../type/user";
import { readJSON, writeJSON } from "../util/jsonConverte";

const pathJson = path.join(__dirname, "..", "..", "cache", "user.json");

export const criarUser = async (user: User) => {

    var arquivo = readJSON(pathJson)
    arquivo.push(user)
    await writeJSON(pathJson, arquivo);
}

export const buscarUser = (remoteJid: string) => {
    return readJSON(pathJson).find(value => value.remoteJid === remoteJid);
}

export const updateUser = async (user: User) => {
    const users: any[] = readJSON(pathJson)
    var usersNew: any[] = []

    users.forEach(value => {
        if (value.remoteJid === user.remoteJid) {
            usersNew.push(user)
        } else {
            usersNew.push(value)
        }
    });
    writeJSON(pathJson, usersNew);
}