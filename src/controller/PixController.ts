import { isCriarPix } from "../util/isCreatePix";
import { mensagem } from "../util/jsonConverte";
import { User } from "../type/user";
import { Result } from "../util/result";
require('dotenv/config');

export const PixController = async (user: User): Promise<Result> => {
    let valor = parseFloat(user?.valor || process.env.VALOR_LOGIN_1_ACESSO || '30');
    let result: Result = { result: false, msg: 'Não foi possível processar o pix no banco.' };
    if (user.acesso === 'revenda') {
        valor = parseFloat(user?.valor || process.env.VALOR_REVENDA || '15');
    }
    if (isCriarPix(user) || user.acesso === 'revenda' || user.acesso === 'adm') {
        var mercadopago = require('mercadopago');
        mercadopago.configurations.setAccessToken(process.env.MP_ACCESSTOKEN);

        var payment_data = {
            transaction_amount: valor,
            description: 'MOVNOW 30D',
            payment_method_id: 'pix',
            external_reference: user.remoteJid,
            payer: {
                email: 'pagamento@movnow.com',
                first_name: 'Movnow',
                last_name: '30D',
                identification: {
                    type: 'CPF',
                    number: '19119119100'
                },
                address: {
                    zip_code: '06233200',
                    street_name: 'Av. das Nações Unidas',
                    street_number: '3003',
                    neighborhood: 'Bonfim',
                    city: 'Osasco',
                    federal_unit: 'SP'
                }
            },
            notification_url: process.env.NOTIFICATION_URL,
        };

        await mercadopago.payment.create(payment_data).then(async (data: any) => {
            result = { result: true, msg: 'Pix criado com sucesso.', data: data.body };
            return result
        }).catch(async function (error) {
            result = { result: false, msg: mensagem('errorPagamento') + error };
            return result
        });
        return result;
    } else {
        result = { result: false, msg: mensagem('errorPagamento') }
        return result;
    }
}