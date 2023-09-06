import axios from "axios";

export const sendMessage = async (contato: string, mensagem: string, remoteJid?: string): Promise<boolean> => {
    let isSend: boolean = false;
    const data = {
        contato: contato,
        mensagem: mensagem,
        remoteJid: remoteJid
    };
    await axios.post('http://localhost:3021/mensagem', data).then(_ => isSend = true).catch(error => console.log(error));
    return isSend;
}
