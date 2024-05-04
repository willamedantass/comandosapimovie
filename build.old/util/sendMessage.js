"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const sendMessage = async (contato, mensagem, remoteJid) => {
    const data = {
        contato: contato,
        mensagem: mensagem,
        remoteJid: remoteJid
    };
    const axios = require('axios');
    await axios.post('http://localhost:3021/mensagem', data).then((_) => console.log(`Solicitado envio da mensagem: ${mensagem} para destino ${contato || remoteJid}`))
        .catch(error => {
        console.error("Erro na solicitação Axios:", error.message);
        if (error.response) {
            console.error("Resposta do servidor:", error.response.data);
        }
    });
};
exports.sendMessage = sendMessage;
