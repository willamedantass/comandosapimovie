
export const sendMessage = async (contato: string, mensagem: string, remoteJid?: string): Promise<void> => {
    const data = {
        contato: contato,
        mensagem: mensagem,
        remoteJid: remoteJid
    };
    const axios = require('axios');
    await axios.post('http://localhost:3021/mensagem', data).then((_: any) => console.info(`Solicitado envio da mensagem para o contato ${data.contato || data.remoteJid}`))
        .catch(error => {
            console.error("Erro na solicitação Axios:", error.message);
            if (error.response) {
                console.error("Resposta do servidor:", error.response.data);
            }
        });
}

export const sendMessageAlerta = async (mensagem: string): Promise<void> => {
    const data = {
        contato: '8588199556',
        mensagem: mensagem,
        remoteJid: ''
    };
    const axios = require('axios');
    await axios.post('http://localhost:3021/mensagem', data).then((_: any) => console.info(`Solicitado envio da mensagem para o contato ${data.contato}`))
        .catch(error => {
            console.error("Erro na solicitação Axios:", error.message);
            if (error.response) {
                console.error("Resposta do servidor:", error.response.data);
            }
        });
}
