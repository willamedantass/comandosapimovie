import { buscarLogin, criarLogin, updateLogin } from "../data/loginDB";
import { getRandomString } from "../util/getRandomString";
import { isCriarTeste } from "../util/isCreateTest";
import { mensagem } from "../util/jsonConverte";
import { updateUser } from "../data/userDB";
import { Acesso, User } from "../type/user";
import { Result } from "../util/result";
import { Login } from "../type/login";
import { uid } from "uid";

export const LoginController = (username: string, isTrial: boolean, isReneew: boolean, user: User): Result => {

    let credito: number = user.credito ? user.credito : 0;
    let result: Result = { result: false, msg: '' };

    if (username.length < 8) {
        result = { result: false, msg: mensagem('errorLoginSize') };
        return result;
    }

    const login = buscarLogin(username);
    if (login && !isReneew) {
        result = { result: false, msg: mensagem('user_existe') };
        return result;
    }

    if (isTrial && user.acesso === Acesso.usuario && !isCriarTeste(user?.data_teste)) {
        result = { result: false, msg: mensagem('limite') };
        return result;
    }

    if (!isTrial && credito <= 0) {
        result = { result: false, msg: mensagem('errorSaldo') };
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
        login.uid = user?.id ? user.id : '',
        login.contato = user.remoteJid.split('@')[0],
        updateLogin(login);
        result = { result: true, msg: 'Login ativado com sucesso.', data: login }
    } else {
        const loginNew: Login = {
            id: uid(8),
            uid: user?.id ? user.id : '',
            user: username,
            contato: user.remoteJid.split('@')[0],
            password: getRandomString(),
            dataCadastro: new Date().toISOString(),
            vencimento: vencimento.toISOString(),
            isLive: true,
            isTrial: isTrial ? true : false
        }
        criarLogin(loginNew)
        result = { result: true, msg: 'Login criado com sucesso.', data: loginNew }
    }

    !isTrial && (user.credito -= 1);
    isTrial && (user.data_teste = new Date().toISOString());
    user.vencimento = vencimento.toISOString();
    updateUser(user);
    return result;
}