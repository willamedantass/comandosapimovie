import { loginAddNew, loginDelete, loginFindByUser, loginUpdate, loginsAll } from "../data/login.service";
import { getRandomString } from "../util/getRandomString";
import { ILogin, LoginModel } from "../type/login.model";
import { isCriarTeste } from "../util/isCreateTest";
import { userUpdate } from "../data/user.service";
import { mensagem } from "../util/getMensagem";
import { Result } from "../util/result";
import { IUser } from "../type/user.model";

export const LoginController = async (username: string, isTrial: boolean, isReneew: boolean, user: IUser): Promise<Result> => {

    let result: Result = { result: false, msg: '' };
    try {
        let credito: number = user.credito ? user.credito : 0;

        if (username.length < 8) {
            result = { result: false, msg: mensagem('errorLoginSize')};
            return result;
        }

        const login: ILogin | null = await loginFindByUser(username);
        if (login && !isReneew) {
            result = { result: false, msg: mensagem('user_existe')};
            return result;
        }

        if (isTrial && user.acesso === 'usuario' && !isCriarTeste(user?.data_teste)) {
            const msg = await mensagem('limite');
            result = { result: false, msg};
            return result;
        }

        if (!isTrial && credito <= 0) {
            result = { result: false, msg: mensagem('errorSaldo')};
            return result;
        }

        const agora = new Date();
        let vencimento = login?.vencimento ? new Date(login.vencimento) : new Date();
        if (isTrial) {
            vencimento = new Date()
            vencimento.setHours(agora.getHours() + 6);
        } else if (vencimento > agora) {
            vencimento.setDate(vencimento.getDate() + 30);
            vencimento.setHours(23, 59, 59, 998);
        } else {
            vencimento = new Date()
            vencimento.setDate(agora.getDate() + 30);
            vencimento.setHours(23, 59, 59, 998);
        }

        if (login) {
            login.vencimento = vencimento.toISOString();
            login.isTrial = false;
            login.uid = user._id;
            login.contato = user.remoteJid.split('@')[0];
            await loginUpdate(login);
            result = { result: true, msg: 'Login ativado com sucesso.', data: login }
        } else {
            const newLogin = await loginAddNew(new LoginModel({
                uid: user?.id ? user.id : '',
                user: username,
                contato: user.remoteJid.split('@')[0],
                password: getRandomString(),
                dataCadastro: new Date().toISOString(),
                vencimento: vencimento.toISOString(),
                isLive: true,
                isTrial: isTrial ? true : false
            }));
            result = { result: true, msg: 'Login criado com sucesso.', data: newLogin }
        }

        if (!isTrial) {
            user.credito -= 1;
            result.msg = `Seu novo saldo em crédito: ${user.credito}`;
        }
        isTrial && (user.data_teste = new Date().toISOString());
        user.vencimento = vencimento.toISOString();
        await userUpdate(user);

    } catch (error) {
        console.error(`Error no metodo loginController, error: ${error?.message}`);
    }
    return result;
}

export const loginRemoveAllTrial = async () => {
    try {
        const loginsTrial = (await loginsAll()).filter(login => login.isTrial);
        for (const login of loginsTrial) {
            const data = new Date(login.vencimento);
            const isRemove = Math.floor((new Date().getTime() - data.getTime()) / (1000 * 60 * 60 * 24)) > 5;
            if (isRemove) {
               await loginDelete(login.id);
            }
        }
    } catch (error) {
        console.error(`Erro para remover logins trial. ${error}`);
    }
}