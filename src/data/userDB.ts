// import { readJSON, writeJSON } from "../util/jsonConverte";
// import { Login } from "../type/login";
// import { User } from "../type/user";
// import path from "path";
// import { LoginFindByUid } from "./login.service";
// const pathJson = path.join(__dirname, "..", "..", "cache", "user.json");

// export const createUser = async (user: User): Promise<string | undefined> => {
//     try {
//         const userNew = await FirestoreUserCreate(user);
//         updateUser(userNew);
//         return userNew.id;
//     } catch (error) {
//         console.error(`Erro ao criar usuário. ${error}`);
//     }
// }

// export const preCreateUser = (user: User): void => {
//     try {
//         const users = allUser();
//         users.push(user);
//         saveAllUser(users);
//     } catch (error) {
//         console.error(`Erro ao criar usuário. ${error}`);
//     }
// }

// export const searchUser = (remoteJid: string): User | undefined => {
//     return allUser().find(value => value.remoteJid === remoteJid);
// }

// export const searchUserLogins = async (remoteJid: string): Promise<Login[]> => {
//     const user = allUser().find(value => value.remoteJid === remoteJid);
//     if (user) {
//         return await LoginFindByUid(user.id);
//     }
//     return [];
// }

// export const allUser = (): User[] => {
//     return readJSON(pathJson);
// }

// export const saveAllUser = (users: User[]) => {
//     writeJSON(pathJson, users);
// }

// export const updateUser = async (user: User) => {
//     try {
//         const usersNew = allUser().map(usr => {
//             if (usr.remoteJid === user.remoteJid) {
//                 return user;
//             }
//             return usr;
//         });
//         //await FirestoreUserUpdate(user);
//         saveAllUser(usersNew);
//     } catch (error) {
//         console.error(`Erro ao atualizar usuário. ${error}`);
//     }
// }