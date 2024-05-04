import { addLivePass } from "../data/livePassDB";
import { LivePass } from "../type/livePass";
require('dotenv/config');

export const CreateLoginApi = async (): Promise<boolean> => {
    const axios = require('axios');
    const res = await axios.post(`${process.env.SERVER_API}/createtest`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS as string }
    }).catch(e => console.log('Não foi possível conectar com a api.', e?.message));

    if (res?.status === 200 && res?.data.result === true) {
        const login: LivePass = res.data.data;
        addLivePass(login);
        console.info(`Login ${login.username}, criado com sucesso.`);
        return true;
    }

    if (res?.status === 200 && res?.data.result === false) {
        console.error(`Erro ao processar os logins. Mensagem da api: ${res?.data.msg}`);
    }

    return false;
}

export const deleteLoginAPI = async (id: string) => {
    const axios = require('axios');
    const res = await axios.post(`${process.env.SERVER_API}/deletetest?id=${id}`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS as string }
    }).catch(e => console.log(e));

    if (res?.status === 200 && res?.data) {
        console.log(res.data.msg);
    }
}