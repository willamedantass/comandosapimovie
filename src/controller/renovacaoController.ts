
import { loginFindByUser, loginUpdate } from "../data/login.service";
import { ILogin } from "../type/login.model";
require('dotenv/config');

export const RenovacaoController = async (req, res) => {
    const req_login = req.params.login;
    if (!req_login) {
        console.log(`Erro no envio dos parametros! Req: ${req_login}`);
        return res.status(400).end();
    }

    let login: ILogin | null = await loginFindByUser(req_login);
    if (login) {
        const agora = new Date();
        let vencimento = new Date(login.vencimento);
        if (agora > vencimento) {
            vencimento.setFullYear(agora.getFullYear(), agora.getMonth(), agora.getDate());
            vencimento.setDate(vencimento.getDate() + 30);
        } else {
            vencimento.setDate(vencimento.getDate() + 30);
        }

        login.vencimento = vencimento.toISOString();
        await loginUpdate(login);
        const options = { timeZone: 'America/Sao_Paulo', hour12: false }
        let msg = '<h1>▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬       📺 *MOVNOW* 📺  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</h1><br>';
        msg += `<h3>Usuário ${login.user} renovado com sucesso! Novo vencimento: ${vencimento.toLocaleString('pt-br', options)}</h3>`;
        return res.send(msg).end();
    }

    res.send(`<h3>Usuário ${req_login} não existe`).end();
}

