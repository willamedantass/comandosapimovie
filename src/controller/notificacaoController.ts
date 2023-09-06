import { searchUser, updateUser } from "../data/userDB";
import { sendMessage } from "../util/sendMessage";
import { mensagem } from "../util/jsonConverte";
import { User } from "../type/user";
require('dotenv/config');

export const notificacaopix = async (req, res) => {
    let payment_info;
    const dados = req.query;

    if (!dados.hasOwnProperty('id') || !dados.hasOwnProperty('topic')) {
        console.error('Erro no envio dos parâmetros da notificação!');
        return res.status(400).end();
    }
    //faz a consulta na api para verificar os pagamentos
    if (dados.topic === 'payment') {
        try {
            var mercadopago = require('mercadopago');
            mercadopago.configurations.setAccessToken(process.env.MP_ACCESSTOKEN);
            payment_info = await mercadopago.payment.get(dados.id)
        } catch (error) {
            console.error('Erro ao consultar api do mercado pago!\n' + error);
            return res.status(400).end();
        }
    } else {
        return res.status(200).end();
    }

    //verifica se o pagamento está aprovado
    if (payment_info.body.status !== 'pending') {
        let details = payment_info.body.transaction_details.transaction_id;
        if (details && payment_info.body.status === 'approved') {
            let remoteJid = payment_info.body.external_reference.trim();
            let user: User | undefined = searchUser(remoteJid);
            if(user === undefined){
                console.error('Usuário de pagamento não encontrado');
                return res.status(200).end();
            }
            //verifica se este pagamento já foi processado.
            let isPayment = user?.pgtos_id?.includes(payment_info.body.id);
            if (isPayment === undefined) {
                isPayment = false;
                user.pgtos_id = [];
            }
            if (isPayment) {
                console.info('Pagamento já foi processado.');
                return res.status(200).end();
            }
            let credito: number = 0;
            if (user?.credito) {
                credito = user.credito;
            }
            credito += 1
            user.pgtos_id.push(payment_info.body.id);
            user.credito = credito;
            updateUser(user)
            sendMessage('', mensagem('pix_aprovado'), remoteJid);
        } else {
            console.info(`Pagamento de transação ${payment_info.body.id} ainda não foi aprovado.`);
        }
    }
    res.status(200).end();
}

