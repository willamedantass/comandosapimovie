import { createAndUpdateCache, readAction } from "../data/cacheDB";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { Cache } from "../type/cache";
import path from "path";
import { logarKOfficeController } from "./logarKOfficeController";
require('dotenv/config');
const pathPhpSessid = path.join(__dirname, "..", "..", "cache", "koffice-phpsessid.json");

export const createLoginWebKOfficeController = async (isLogar: boolean) => {
    const action = 'create_login'
    const url_server = process.env.URL_PAINELWEB_KOFFICE;
    let cache: Cache = await readAction(action);
    const dataOld = new Date(cache?.data);
    const dataNow = new Date();
    const countCache = cache.count || 0;
    if (dataOld.getMinutes() === dataNow.getMinutes() && countCache > 4) {
        return { result: false, msg: 'Excesso de logins criado, tente novamente daqui 1 minuto.' }
    }
    
    let isError404 = false;
    const phpSessid = readJSON(pathPhpSessid)?.token || 'PHPSESSID=osfqii9avtprc2khamohugfbsi';
    const axios = require('axios');
    const url = `${url_server}/dashboard/api/?fast_test`;
   
    const res = await axios.post(url, null, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'origin': url_server,
            'referer': `${url_server}/clients/`,
            'x-requested-with': 'XMLHttpRequest',
            'Cookie': phpSessid
        }
    }).catch(res => {
        isError404 = res?.response?.status === 404;
    });

    if (!isError404 && isLogar && res && res?.status == 200 && typeof res?.data === 'string' && res.data?.includes(`${process.env.URL_PAINELWEB_KOFFICE}/login/`)) {
        console.log('Fazendo login...');
        isLogar = false;
        await logarKOfficeController();
        return createLoginWebKOfficeController(false);
    }

    if (!isError404 && res && res?.status === 200 && typeof res?.data === 'object') {
        cache = { data: new Date().toISOString(), action: action, count: countCache > 4 ? 0 : countCache + 1} as Cache
        createAndUpdateCache(cache);
        const login = res.data.message.split('<br />').filter(line => line.includes('Usuário') || line.includes('Senha'));
        const username = login[0].split(':')[1].trim();
        const password = login[1].split(':')[1].trim();
        return { result: true, msg: 'Login criado com sucesso!', user: username, pass: password };
    }

    return { result: false, msg: 'Erro ao gerar login!' };
}