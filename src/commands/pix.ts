import { buscarUser, updateUser } from "../data/userDB";
import { isCriarPix } from "../function";
import { IBotData } from "../Interface/IBotData";
import { Acesso } from "../type/user";
import { StringsMsg } from "../util/stringsMsg";

export default async ({ remoteJid, reply, sendText, owner }: IBotData) => {
    let user = buscarUser(remoteJid);
    if (user) {        
        let valor = parseFloat(process.env.VALOR_LOGIN_1_ACESSO || '');
        let description = 'MOVNOW 30D'
        if(user.acesso === Acesso.revenda){
            valor = parseFloat(process.env.VALOR_REVENDA || '');
        }
        if (isCriarPix(user.dataPix) || user.acesso === Acesso.revenda || owner ) {
            var mercadopago = require('mercadopago');
            mercadopago.configurations.setAccessToken(process.env.MP_ACCESSTOKEN);
            
            var payment_data = {
                transaction_amount: valor,
                description: description,
                payment_method_id: 'pix',
                external_reference: remoteJid,
                payer: {
                    email: 'pagamento@internet.com',
                    first_name: 'Producao',
                    last_name: 'User',
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

            mercadopago.payment.create(payment_data).then(
                async function (data) {
                    await reply(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n📌 *DETALHES DA COMPRA* 📌\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n🛍️ *PRODUTO:* ${description}\n💰 *PREÇO:* ${valor}\n📅 *VALIDADE:* 30 Dias\n🔰 *FORMA DE PAGAMENTO:* PIX COPIA E COLA`);
                    await sendText(false, data.body.point_of_interaction.transaction_data.qr_code);
                    await sendText(false, StringsMsg.pix)
                    user.dataPix = new Date().toISOString();
                    await updateUser(user)
                }).catch(async function (error) {
                    await reply(StringsMsg.errorPagamento)
                });
        } else {
            await reply(StringsMsg.errorPagamento)
        }
    } else {
        await reply(StringsMsg.errorUser);
    }
};
