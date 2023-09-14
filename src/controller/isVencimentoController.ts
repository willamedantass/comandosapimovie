import { sendMessage } from "../util/sendMessage";
import { mensagem } from "../util/jsonConverte";
import { updateLogin } from "../data/loginDB";
import { Login } from "../type/login";

export const isVencimentoController = async (login: Login): Promise<boolean> => {
    
    const agora = new Date();
    const vencimento = new Date(login.vencimento);
    const dataMensagem: Date = new Date(login?.data_msg_vencimento || '');
    if (agora > vencimento) {
        if (dataMensagem.getDay() !== agora.getDay()) {
            const contato = login?.contato ? login.contato : '8588199556';
            await sendMessage(contato, mensagem('vencimento', login.user));
            login.data_msg_vencimento = new Date().toISOString();
            updateLogin(login);
        }
        console.info(`Login expirado! Usuário: ${login.user}`);
        return true;
    }

    const dias: number = Math.floor((vencimento.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (dias <= 3 && dias > 0 && dataMensagem.getDay() !== agora.getDay()) {
        const contato = login?.contato ? login.contato : '8588199556';
        const msg: string = `Olá, ${login.user}\n\nEstamos passando para lembrar que sua assinatura vencerá em apenas ${dias === 1 ? '1 dia' : dias+' dias'}!\n\n\Não deixe para a última hora, renove agora mesmo e continue aproveitando nossos serviços de qualidade, é só digitar *Menu* - opção 3.`;
        await sendMessage(contato, msg);
        login.data_msg_vencimento = new Date().toISOString();
        updateLogin(login);
    }
    return false
}