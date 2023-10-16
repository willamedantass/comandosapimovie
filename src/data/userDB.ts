import { FirestoreUserCreate, FirestoreUserUpdate } from "./userFirestore";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { searchLoginsPorUId } from "./loginDB";
import { Login } from "../type/login";
import { User } from "../type/user";
import path from "path";
const pathJson = path.join(__dirname, "..", "..", "cache", "user.json");

export const createUser = async (user: User): Promise<string | undefined> => {
    try {
        const users = allUser();
        const userNew = await FirestoreUserCreate(user);
        users.push(userNew);
        saveAllUser(users);
        return userNew.id;
    } catch (error) {
        console.error(`Erro ao criar usuário. ${error}`);
    }
}

export const searchUser = (remoteJid: string): User | undefined => {
    return allUser().find(value => value.remoteJid === remoteJid);
}

export const searchUserLogins = (remoteJid: string): Login[] => {
    const user = allUser().find(value => value.remoteJid === remoteJid);
    if (user) {
        return searchLoginsPorUId(user.id);
    }
    return [];
}

export const allUser = (): User[] => {
    return readJSON(pathJson);
}

export const saveAllUser = (users: User[]) => {
    writeJSON(pathJson, users);
}

export const updateUser = async (user: User) => {
    try {
        const usersNew = allUser().map(usr => {
            if (usr.remoteJid === user.remoteJid) {
                return user;
            }
            return usr;
        });
        await FirestoreUserUpdate(user);
        saveAllUser(usersNew);
    } catch (error) {
        console.error(`Erro ao atualizar usuário. ${error}`);
    }
}