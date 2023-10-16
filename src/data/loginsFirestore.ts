import { Firestore } from "./firestore";
import { Login } from "../type/login";

export const FirestoreLoginAll = async (): Promise<Login[]> => {
    try {
        const snapshot = await Firestore.collection('logins').get();
        const logins = snapshot.docs.map((doc) => {
            return doc.data() as Login;
        });
        return logins;
    } catch (error) {
        throw new Error(`Erro ao listar os logins. ${error}`);
    }
}

export const FirestoreLoginCreate = async (login: Login): Promise<Login> => {
    try {
        const loginsRef = Firestore.collection('logins').doc();
        login.id = loginsRef.id;
        await loginsRef.set(login);
        console.info(`Login salvo com sucesso no firestore! Id ${loginsRef.id}`);
        return login;
    } catch (error) {
        throw new Error(`Erro ao salvar dados no firestore. ${error}`);
    }
}

export const FirestoreLoginUpdate = async (login: Login) => {
    try {
        const loginsRef = Firestore.collection('logins').doc(login.id);
        await loginsRef.set(login, { merge: true });
        console.info('Login atualizado com sucesso.');
    } catch (error) {
        console.error(`Erro ao atualizar o login. ${error}`);
    }
}

export const FirestoreLoginDelete = async (login: Login) => {
    try {
        const loginsRef = Firestore.collection('logins').doc(login.id);
        await loginsRef.delete();
        if (!login.isTrial) {
            const loginsExcluidosRef = Firestore.collection('logins-excluidos').doc(login.id);
            await loginsExcluidosRef.set(login);
        }
        console.log('Login excluído com sucesso.');
    } catch (error) {
        console.error(`Erro ao excluir o login. ${error}`);
    }
}