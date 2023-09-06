import path from "path";
import { User } from "../type/user";
import { readJSON, writeJSON } from "../util/jsonConverte";

const pathJson = path.join(__dirname, "..", "..", "cache", "user.json");

export const createUser = async (user: User) => {
    const arquivo = readJSON(pathJson);
    arquivo.push(user)
    await writeJSON(pathJson, arquivo);
}

export const searchUser = (remoteJid: string): User | undefined => {
    return allUser().find(value => value.remoteJid === remoteJid);
}
export const allUser = (): User[] => {
    return readJSON(pathJson);
}

export const updateUser = (user: User): void => {
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