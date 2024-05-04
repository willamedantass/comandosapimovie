import { gerarMensagemIa } from "../util/getMensagem";
import { loginUpdate } from "../data/login.service";
import { sendMessage } from "../util/sendMessage";
import { ILogin } from "../type/login.model";
import { Mutex } from "async-mutex";

const mutex = new Mutex();
export const isVencimentoController = async (login: ILogin): Promise<boolean> => {
    return await mutex.runExclusive(async () => {
        const agora = new Date();
        const vencimento = new Date(login.vencimento);
        const dataMensagem: Date = new Date(login?.data_msg_vencimento || '');
        if (agora > vencimento) {
            if (dataMensagem.getDay() !== agora.getDay()) {
                const contato = login?.contato ? login.contato : '8588199556';
                const msg = await gerarMensagemIa('vencido', { nome: login.user });
                await sendMessage(contato, msg);
                login.data_msg_vencimento = new Date().toISOString();
                await loginUpdate(login);
            }
            console.info(`Login expirado! Usuário: ${login.user}`);
            return true;
        }

        const dias: number = Math.floor((vencimento.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (dias <= 3 && dias > 0 && dataMensagem.getDay() !== agora.getDay()) {
            const contato = login?.contato ? login.contato : '8588199556';
            const msg = await gerarMensagemIa('vai_vencer', { nome: login.user, dias: dias.toString() });
            await sendMessage(contato, msg);
            login.data_msg_vencimento = new Date().toISOString();
            await loginUpdate(login);
        }
        return false
    })
}