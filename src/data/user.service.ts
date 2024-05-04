import { ObjectId } from "mongoose";
import { IUser, UserModel } from "../type/user.model";

export const userAll = async () => {
    try {
        return await UserModel.find({});
    } catch (error) {
        throw new Error(`Erro ao buscar todos os usuários. ${error?.message}`);
    }
}

export const userAddNew = async (user: IUser): Promise<IUser> => {
    try {
        const newUser = await UserModel.create(user);
        console.log('Novo usuário adicionado com sucesso:', newUser);
        return newUser;
    } catch (error) {
        throw new Error(`Erro ao criar usuário. ${error?.message}`);
    }
}

export const userFindByNome = async (nome: string) => {
    try {
        return await UserModel.findOne({ nome: nome });
    } catch (error) {
        throw new Error(`Erro ao buscar o nome do usuário. ${error?.message}`);
    }
}

export const userFindByRemoteJid = async (remoteJid: string): Promise<IUser|null> => {
    try {
        return await UserModel.findOne({ remoteJid });
    } catch (error) {
        throw new Error(`Erro ao buscar users por uid. ${error?.message}`);
    }
}

export const userUpdate = async (userUpdated: IUser): Promise<IUser|null> => {
    try {
        const user = await UserModel.findById(userUpdated.id);
        if (!user) {
            console.error('Usuário não encontrado!');
            return null;
        }

        Object.assign(user, userUpdated);
        await user.save();
        console.log('Usuário atualizado com sucesso.');
        return user;
    } catch (error) {
        throw new Error(`Erro ao atualizar usuário. ${error?.message}`);
    }
}

export const userDelete = async (id: ObjectId): Promise<IUser|null> => {
    try {
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            console.error(`Usuário não encontrado!`);
            return null;
        }
        
        await UserModel.deleteOne(user.id);
        console.log('Usuário excluído com sucesso:', user);
        return user;
    } catch (error) {
        throw new Error(`Erro ao excluir usuário. ${error?.message}`);
    }
}