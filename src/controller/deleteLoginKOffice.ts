import path from "path";
import { readJSON } from "../util/jsonConverte";
import { logarKOfficeController } from "./logarKOfficeController";
const pathPhpSessid = path.join(__dirname, "..", "..", "cache", "phpsessid.json");
const FormData = require('form-data');
require('dotenv/config')

export const deleteLoginKOffice = async (isLogar: boolean) => {
    console.log('Executando exclusão dos logins expirados....');
    
    const url_server = process.env.URL_PAINELWEB_KOFFICE;
    let isError404 = false;
    const phpSessid = readJSON(pathPhpSessid)?.token || 'PHPSESSID=osfqii9avtprc2khamohugfbsi';
    const axios = require('axios');
    const form_data = FilterFormData();

    const url_clients = `${url_server}/clients/api/?get_clients`;
    const res = await axios.post(url_clients, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'origin': url_server,
            'referer': `${url_server}/clients/`,
            'x-requested-with': 'XMLHttpRequest',
            'Cookie': phpSessid
        }
    }).catch(async res => {
        console.log('Erro class deleteLoginKOffice.');
        isError404 = res?.response?.status === 404;
    });

    if (isLogar && !isError404 && res && res?.status == 200 && typeof res?.data === 'string' && res.data?.includes(`${process.env.URL_PAINELWEB_KOFFICE}/login/`)) {
        console.log('Fazendo login na plataforma web...');
        await logarKOfficeController();
        return deleteLoginKOffice(false);
    }

    if (!isError404 && res && res?.status === 200 && typeof res?.data === 'object') {
        for (let user of res.data['data']) {
            if (user[8].replace(/<span class="badge badge-warning">(.*?)<\/span>/, '$1') === 'Expirado') {
                const url_delete = `${url_server}/clients/api/?delete_client&client_id=${user[0]}`;
                const res_delete = await axios.post(url_delete, null, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                        'accept': 'application/json, text/javascript, */*; q=0.01',
                        'origin': url_server,
                        'referer': `${url_server}/clients/`,
                        'x-requested-with': 'XMLHttpRequest',
                        'Cookie': phpSessid
                    }
                }).catch(res => {
                    console.log('Erro ao deletar usuário.');
                });
                console.log(`Login ${user[0]} excluido: ${res_delete?.data.result}`);
            }
        }
    }

    console.log('Processo de exclusão dos logins expirados, finalizado com sucesso.');
    
}

const FilterFormData = () => {
    const form_data = new FormData();
    form_data.append("draw", '1');
    form_data.append('columns[0][data]', '0');
    form_data.append('columns[0][name]', '');
    form_data.append('columns[0][searchable]', 'true');
    form_data.append('columns[0][orderable]', 'true');
    form_data.append('columns[0][search][value]', '');
    form_data.append('columns[0][search][regex]', 'false');
    form_data.append('columns[1][data]', '1');
    form_data.append('columns[1][name]', '');
    form_data.append('columns[1][searchable]', 'true');
    form_data.append('columns[1][orderable]', 'true');
    form_data.append('columns[1][search][value]', '');
    form_data.append('columns[1][search][regex]', 'false');
    form_data.append('columns[2][data]', '2');
    form_data.append('columns[2][name]', '');
    form_data.append('columns[2][searchable]', 'true');
    form_data.append('columns[2][orderable]', 'true');
    form_data.append('columns[2][search][value]', '');
    form_data.append('columns[2][search][regex]', 'false');
    form_data.append('columns[3][data]', '3');
    form_data.append('columns[3][name]', '');
    form_data.append('columns[3][searchable]', 'true');
    form_data.append('columns[3][orderable]', 'true');
    form_data.append('columns[3][search][value]', '');
    form_data.append('columns[3][search][regex]', 'false');
    form_data.append('columns[4][data]', '4');
    form_data.append('columns[4][name]', '');
    form_data.append('columns[4][searchable]', 'true');
    form_data.append('columns[4][orderable]', 'true');
    form_data.append('columns[4][search][value]', '');
    form_data.append('columns[4][search][regex]', 'false');
    form_data.append('columns[5][data]', '5');
    form_data.append('columns[5][name]', '');
    form_data.append('columns[5][searchable]', 'true');
    form_data.append('columns[5][orderable]', 'true');
    form_data.append('columns[5][search][value]', '');
    form_data.append('columns[5][search][regex]', 'false');
    form_data.append('columns[6][data]', '6');
    form_data.append('columns[6][name]', '');
    form_data.append('columns[6][searchable]', 'true');
    form_data.append('columns[6][orderable]', 'true');
    form_data.append('columns[6][search][value]', '');
    form_data.append('columns[6][search][regex]', 'false');
    form_data.append('columns[7][data]', '7');
    form_data.append('columns[7][name]', '');
    form_data.append('columns[7][searchable]', 'true');
    form_data.append('columns[7][orderable]', 'true');
    form_data.append('columns[7][search][value]', '');
    form_data.append('columns[7][search][regex]', 'false');
    form_data.append('columns[8][data]', '8');
    form_data.append('columns[8][name]', '');
    form_data.append('columns[8][searchable]', 'true');
    form_data.append('columns[8][orderable]', 'true');
    form_data.append('columns[8][search][value]', '');
    form_data.append('columns[8][search][regex]', 'false');
    form_data.append('columns[9][data]', '9');
    form_data.append('columns[9][name]', '');
    form_data.append('columns[9][searchable]', 'true');
    form_data.append('columns[9][orderable]', 'true');
    form_data.append('columns[9][search][value]', '');
    form_data.append('columns[9][search][regex]', 'false');
    form_data.append('order[0][column]', '0');
    form_data.append('order[0][dir]', 'desc');
    form_data.append('start', '0');
    form_data.append('length', '100');
    form_data.append('search[value]', '');
    form_data.append('search[regex]', 'false');
    form_data.append('filter_value', '#');
    form_data.append('reseller_id', '-1');
    return form_data;
}
