"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreLoginDelete = exports.FirestoreLoginUpdate = exports.FirestoreLoginCreate = exports.FirestoreLoginAll = void 0;
const firestore_1 = require("./firestore");
const FirestoreLoginAll = async () => {
    try {
        const snapshot = await firestore_1.Firestore.collection('logins').get();
        const logins = snapshot.docs.map((doc) => {
            return doc.data();
        });
        return logins;
    }
    catch (error) {
        throw new Error(`Erro ao listar os logins. ${error}`);
    }
};
exports.FirestoreLoginAll = FirestoreLoginAll;
const FirestoreLoginCreate = async (login) => {
    try {
        const loginsRef = firestore_1.Firestore.collection('logins').doc();
        login.id = loginsRef.id;
        await loginsRef.set(login);
        console.info(`Login salvo com sucesso no firestore! Id ${loginsRef.id}`);
        return login;
    }
    catch (error) {
        throw new Error(`Erro ao salvar dados no firestore. ${error}`);
    }
};
exports.FirestoreLoginCreate = FirestoreLoginCreate;
const FirestoreLoginUpdate = async (login) => {
    try {
        const loginsRef = firestore_1.Firestore.collection('logins').doc(login.id);
        await loginsRef.set(login, { merge: true });
        console.info('Login atualizado com sucesso.');
    }
    catch (error) {
        console.error(`Erro ao atualizar o login. ${error}`);
    }
};
exports.FirestoreLoginUpdate = FirestoreLoginUpdate;
const FirestoreLoginDelete = async (login) => {
    try {
        const loginsRef = firestore_1.Firestore.collection('logins').doc(login.id);
        await loginsRef.delete();
        if (!login.isTrial) {
            const loginsExcluidosRef = firestore_1.Firestore.collection('logins-excluidos').doc(login.id);
            await loginsExcluidosRef.set(login);
        }
        console.log('Login excluído com sucesso.');
    }
    catch (error) {
        console.error(`Erro ao excluir o login. ${error}`);
    }
};
exports.FirestoreLoginDelete = FirestoreLoginDelete;
