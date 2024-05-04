// import { saveAllLogins } from "./loginDB";
// import { FirestoreLoginAll } from "./loginsFirestore";
// import { saveAllUser } from "./userDB";
// import { FirestoreUserAll } from "./userFirestore";

// export const pullDb = async () => {
//     try {
//         const users = await FirestoreUserAll();
//         saveAllUser(users)
//         const logins = await FirestoreLoginAll();
//         saveAllLogins(logins);
//         console.info('Banco de dados sincronizado com sucesso!');
//     } catch (error) {
//         console.error(`Erro ao sincronizar banco de dados. ${error}`);
//     }
// }