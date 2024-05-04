"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreUserUpdate = exports.FirestoreUserCreate = exports.FirestoreUserAll = void 0;
const firestore_1 = require("./firestore");
const FirestoreUserAll = async () => {
    try {
        const snapshot = await firestore_1.Firestore.collection('users').get();
        const users = snapshot.docs.map((doc) => {
            return doc.data();
        });
        return users;
    }
    catch (error) {
        throw new Error(`Erro ao listar os contatos. ${error}`);
    }
};
exports.FirestoreUserAll = FirestoreUserAll;
const FirestoreUserCreate = async (user) => {
    try {
        const usersRef = firestore_1.Firestore.collection('users').doc();
        user.id = usersRef.id;
        await usersRef.set(user);
        console.info(`Contato salvo com sucesso no firestore! Id ${usersRef.id}`);
        return user;
    }
    catch (error) {
        throw new Error(`Erro ao salvar dados no firestore. ${error}`);
    }
};
exports.FirestoreUserCreate = FirestoreUserCreate;
const FirestoreUserUpdate = async (user) => {
    try {
        const userRef = firestore_1.Firestore.collection('users').doc(user.id);
        await userRef.set(user, { merge: true });
        console.info('Usuário atualizado com sucesso.');
    }
    catch (error) {
        console.error(`Erro ao atualizar o usuário: ${error}`);
    }
};
exports.FirestoreUserUpdate = FirestoreUserUpdate;
