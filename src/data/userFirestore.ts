// import { User } from "../type/user";

// export const FirestoreUserAll = async (): Promise<User[]> => {
//     try {
//         const snapshot = await Firestore.collection('users').get();
//         const users = snapshot.docs.map((doc) => {
//             return doc.data() as User;
//         });
//         return users;
//     } catch (error) {
//         throw new Error(`Erro ao listar os contatos. ${error}`);
//     }
// }

// export const FirestoreUserCreate = async (user: User): Promise<User> => {
//     try {
//         const usersRef = Firestore.collection('users').doc();
//         user.id = usersRef.id;
//         await usersRef.set(user);
//         console.info(`Contato salvo com sucesso no firestore! Id ${usersRef.id}`);
//         return user;
//     } catch (error) {
//         throw new Error(`Erro ao salvar dados no firestore. ${error}`);
//     }
// }

// export const FirestoreUserUpdate = async (user: User) => {
//     try {
//         const userRef = Firestore.collection('users').doc(user.id);
//         await userRef.set(user, { merge: true });
//         console.info('Usuário atualizado com sucesso.');
//     } catch (error) {
//         console.error(`Erro ao atualizar o usuário: ${error}`);
//     }
// }