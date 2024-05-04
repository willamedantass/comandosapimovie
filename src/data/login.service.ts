import { ILogin, LoginModel } from "../type/login.model";
import { LoginExcluidoModel } from "../type/loginExcluido.model";

export const loginsAll = async () => {
    try {
        return await LoginModel.find({});
    } catch (error) {
        throw new Error(`Erro ao buscar todos os logins. ${error?.message}`);
    }
}

export const loginAddNew = async (login: ILogin): Promise<ILogin> => {
    try {
        const newLogin = await LoginModel.create(login);
        console.log('Novo login adicionado com sucesso:', newLogin);
        return newLogin;
    } catch (error) {
        throw new Error(`Erro ao criar login. ${error?.message}`);
    }
}

export const loginFindByUser = async (username: string): Promise<ILogin|null> => {
    try {
        return await LoginModel.findOne({ user: username });
    } catch (error) {
        throw new Error(`Erro ao buscar login por usuário. ${error?.message}`);
    }
}

export const LoginFindByUid = async (uid: string) => {
    try {
        const logins: ILogin[] | null = await LoginModel.find({ uid });
        return logins;
    } catch (error) {
        throw new Error(`Erro ao buscar logins por uid. ${error?.message}`);
    }
}

export const loginUpdate = async (loginUpdated: ILogin) => {
    try {
        const login = await LoginModel.findById(loginUpdated.id);
        if (!login) {
            return console.error('Login não encontrado');
        }
        Object.assign(login, loginUpdated);
        await login.save();
        console.log(`Login ${loginUpdated.user} atualizado com sucesso!`);
        return login;
    } catch (error) {
        throw new Error(`Erro ao atualizar login. ${error?.message}`);
    }
}

export const loginDelete = async (id: string) => {
    try {
        const login = await LoginModel.findById(id);
        if (!login) {
            throw new Error('Login não encontrado');
        }
        
        await LoginModel.deleteOne(login.id);
        if (!login.isTrial) {
            LoginExcluidoModel.create(login);
        }
        console.log('Login excluído com sucesso:', login);
        return login;
    } catch (error) {
        throw new Error(`Erro ao excluir login. ${error?.message}`);
    }
}