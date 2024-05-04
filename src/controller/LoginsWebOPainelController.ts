import { createAndUpdateCache, readAction } from "../data/cacheDB";
import { logarOPainelController } from "./logarOPainelController";
import { toStringDate } from "../util/toStringDate";
import { addLivePass } from "../data/livePassDB";
import { readJSON } from "../util/jsonConverte";
import { LivePass } from "../type/livePass";
import { Cache } from "../type/cache";
import path from "path";
require('dotenv/config');
const axios = require('axios');
const pathPhpSessid = path.join(__dirname, "..", "..", "cache", "opainel-phpsessid.json");
let isError404: boolean = false;

export const createLoginOPainel = async (isLogar: boolean) => {
    const action = 'create_login'
    let cache: Cache = await readAction(action);

    const dataOld = new Date(cache?.data);
    const dataNow = new Date();
    const countCache = cache.count || 0;
    if (dataOld.getMinutes() === dataNow.getMinutes() && countCache > 5) {
        return { result: false, msg: 'Excesso de logins criado, tente novamente daqui 1 minuto.' }
    }

    console.log(`criaando login.....`);
    const res = await axios_res('Customers', 'createTest');
    if (!isError404 && isLogar && res && res?.status == 200 && typeof res?.data === 'string' && res.data?.includes('Erro na Linha: #0')) {
        console.log('Fazendo login...');
        isLogar = false;
        await logarOPainelController();
        return createLoginOPainel(false);
    }

    if (!isError404 && res && res?.status === 200 && typeof res?.data.ajax === 'object') {
        const id = res.data.ajax[0].AjaxData.split('=')[3];
        const res_login = await axios_res('Customers', 'modalShow', id);

        if (!isError404 && res_login && res_login?.status === 200 && typeof res_login?.data.content === 'object') {
            const login = res_login?.data.content['#ModalBody'].split('\r\n').filter(line => line.includes('Usuário') || line.includes('Senha') || line.includes('Data de validade'));
            addLivePass({
                id: id,
                username: login[0].split('*')[2].trim(),
                password: login[1].split('*')[2].trim(),
                vencimento: toStringDate(login[2].split('*')[2].trim()).toISOString(),
                isTrial: true,
                isDelete: false,
                countUsed: 0,
                isUsed: false
            } as LivePass);

            cache = { data: new Date().toISOString(), action: action, count: countCache > 5 ? 0 : countCache + 1 } as Cache
            createAndUpdateCache(cache);
            console.log(`Login temporário criado com sucesso. Contador - ${countCache}`);
        }
    }
}

export const createLoginAPI = async (): Promise<boolean> => {

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

export const deleteLoginOPainel = async (isLogar: boolean, id: string) => {
    const res = await axios_res('Customers', 'delete', id);

    if (!isError404 && isLogar && res && res?.status == 200 && typeof res?.data === 'string' && res.data?.includes('Erro na Linha: #0')) {
        console.log('Fazendo login...');
        isLogar = false;
        await logarOPainelController();
        return deleteLoginOPainel(false, id);
    }

    if (!isError404 && res && res?.status === 200 && typeof res?.data === 'object') {
        const result: boolean = res.data?.trigger.includes('Registro deletado com sucesso.');
        if (result) {
            console.log(`Registro ${id} deletado com sucesso.`);
        } else {
            console.log(`Não foi possível deletar o registro ${id}.`);
        }
    }
}

export const deleteLoginAPI = async (id: string) => {

    const res = await axios.post(`${process.env.SERVER_API}/deletetest?id=${id}`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS as string }
    }).catch(e => console.log(e));

    if (res?.status === 200 && res?.data) {
        console.log(res.data.msg);
    }
}

const axios_res = async (ajaxfile: string, ajaxAction: string, id?: string) => {
    isError404 = false;
    const url_painel = process.env.URL_PAINELWEB_OPAINEL;
    const url = `${url_painel}/src/ajax/Customers.ajax.php`;
    const phpSessid = readJSON(pathPhpSessid)?.token || 'PHPSESSID=osfqii9avtprc2khamohugfbsi';
    const FormData = require('form-data');
    const form_data = new FormData();
    form_data.append('AjaxFile', ajaxfile);
    form_data.append('AjaxAction', ajaxAction);
    id ? form_data.append('id', id) : null

    const res = await axios.post(url, form_data, null, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'Cookie': phpSessid
        }
    }).catch(res => {
        console.log('Erro ao acessar servidor NEWPLAY.');
        isError404 = res?.response?.status === 404;
    });

    return res;
}