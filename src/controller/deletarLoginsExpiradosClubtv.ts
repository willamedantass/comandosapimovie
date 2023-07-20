import { createXAcessTokenClubtv } from "./createXAcessTokenClubtv";
import { readJSON } from "../util/jsonConverte";
import sleep from "../util/sleep";
import path from "path";
require('dotenv/config');
let isLogar = true;

export const deletarLoginsExpirados = async () => {

    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const urlClubApi = process.env.URL_CLUBTV_API;
    const pathSessionClub = path.join(__dirname, "..", "..", "cache", "session_club.json");
    const x_access_token = readJSON(pathSessionClub)?.token || '000000000';
    const url: string = `${urlClubApi}/listas/deletar_expiradas`;
    
    form_data.append('testes', 1);
    form_data.append('tipo', 'minhas');

    await axios.post(url, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x_access_token': x_access_token
        }
    }).then((res) => {
        if (res.data?.result) {
            console.log('Sucesso no processo de exclusão de logins expirados.');
            isLogar = false;
        }
    }).catch(async (res) => {
        console.log(`Erro no processo de exclusão dos logins expirados: ${res}`);
        if (res?.response.status > 499) {
            isLogar = false;
        }
    });

    if (isLogar) {
        console.log(`Fazendo login no portal do clubtv...`);
        isLogar = false;
        await createXAcessTokenClubtv();
        await sleep(3000);
    }
}