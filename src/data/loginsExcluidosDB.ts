// import { readJSON, writeJSON } from "../util/jsonConverte";
// import { Login } from "../type/login";
// import path from "path";
// const pathJson = path.join(__dirname, "..", "..", "cache", "logins-excluidos.json");

// export const criarLoginsExcluidos = (login: Login): void => {
//     var arquivo = readJSON(pathJson);
//     arquivo.push(login)
//     writeJSON(pathJson, arquivo);
// }

// export const readLoginsExcluidos = (): Login[] => {
//     return readJSON(pathJson);
// }

// export const searchLoginsExcluidosPorUsername = (username: string): Login | undefined => {
//     return readLoginsExcluidos().find((value: Login) => value.user === username);
// }

// export const searchLoginsPorUId = (uid: string): Login[] => {
//     return readLoginsExcluidos().filter((value: Login) => {
//         return value.uid === uid;
//     });
// }

// export const updateLoginsExcluidos = (login: Login): void => {
//     const logins = readJSON(pathJson)
//     var loginsNew: any[] = []

//     logins.forEach(value => {
//         if (value.user === login.user) {
//             loginsNew.push(login)
//         } else {
//             loginsNew.push(value)
//         }
//     });
//     writeJSON(pathJson, loginsNew);
// }