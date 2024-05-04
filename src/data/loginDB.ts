// import { readJSON, writeJSON } from "../util/jsonConverte";
// import path from "path";
// import { loginAddNew } from "./login.service";
// import { ILogin } from "../type/login.model";
// const pathJson = path.join(__dirname, "..", "..", "cache", "login.json");

// export const criarLogin = async (login: ILogin) => {
//     try {
//         const loginNew = await loginAddNew(login)
//     } catch (error) {
//         console.error(`Erro ao criar login. ${error}`);
//     }
// }

// export const allLogins = (): Login[] => {
//     return readJSON(pathJson);
// }

// export const saveAllLogins = (logins: Login[]) => {
//     writeJSON(pathJson, logins);
// }

// export const searchLoginPorUsername = (username: string): Login | undefined => {
//     return allLogins().find((value: Login) => value.user === username);
// }

// export const searchLoginsPorUId = (uid: string): Login[] => {
//     return allLogins().filter((value: Login) => {
//         return value.uid === uid;
//     });
// }


// export const updateLoginLocal = (login: Login) => {
//     try {
//         const loginsNew: Login[] = allLogins().map(log => {
//             if (log.user === login.user) {
//                 return login;
//             }
//             return log;
//         });
//         saveAllLogins(loginsNew);
//     } catch (error) {
//         console.error(`Erro ao atualizar login. ${error}`);
//     }
// }

// export const updateLogin = async (login: Login) => {
//     try {
//         const loginsNew: Login[] = allLogins().map(log => {
//             if (log.user === login.user) {
//                 return login;
//             }
//             return log;
//         });
//         // await FirestoreLoginUpdate(login);
//         saveAllLogins(loginsNew);
//     } catch (error) {
//         console.error(`Erro ao atualizar login. ${error}`);
//     }
// }

// export const removeLogin = async (username: string): Promise<string> => {
//     try {
//         const login = searchLoginPorUsername(username);
//         if (login === undefined) { return 'Login não encontrado' };
//         const loginsNew = allLogins().filter(obj => obj.id !== login.id);
//         await FirestoreLoginDelete(login);
//         saveAllLogins(loginsNew);
//         return 'Login excluído com sucesso.';
//     } catch (error) {
//         console.error(`Erro ao excluir login. ${error}`);
//         return 'Erro ao excluir login';
//     }
// }

// export const removeTrial = async () => {
//     try {
//         const loginsTrial = allLogins().filter(login => login.isTrial);
//         for (const login of loginsTrial) {
//             const data = new Date(login.vencimento);
//             const isRemove = Math.floor((new Date().getTime() - data.getTime()) / (1000 * 60 * 60 * 24)) > 5;
//             if (isRemove) {
//                 await removeLogin(login.user);
//             }
//         }
//     } catch (error) {
//         console.error(`Erro para remover logins trial. ${error}`);
//     }
// }