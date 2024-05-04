import { createAndUpdateCache, readAction } from "../data/cacheDB";
import { getRandomString } from "../util/getRandomString";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { Cache } from "../type/cache";
import sleep from "../util/sleep";
import path from "path";
import { StringClean } from "../util/stringClean";
import { Names } from "../util/names";
import { createXAcessTokenClubtv } from "./createXAcessTokenClubtv";
import { Result } from "../util/result";
require('dotenv/config');

const createWebLoginClub = async (isLogar: boolean): Promise<Result> => {

    const pathSessionClub = path.join(__dirname, "..", "..", "cache", "session_club.json");
    const action = 'create_login_club'
    let cache: Cache = await readAction(action);
    const dataOld = new Date(cache.data);
    const dataNow = new Date();
    const count = cache.count || 0;
    if (dataOld.getMinutes() === dataNow.getMinutes() && count > 4) {
        return { result: false, msg: 'Excesso de logins criado, tente novamente daqui 1 minuto.' }
    }

    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const urlClubApi = process.env.URL_CLUBTV_API;
    const x_access_token = readJSON(pathSessionClub)?.token || '000000000';
    const url: string = `${urlClubApi}/listas/teste`;
    const username: string = StringClean(Names[Math.floor(Math.random() * Names.length)])+'mwsn';
    const password: string = (getRandomString() + '5');
    let response: Result = { result: false, msg: '' };
    form_data.append('adulto', 35);
    form_data.append('horas', 6);
    form_data.append('username', username);
    form_data.append('nitro', 0);
    form_data.append('password', password);

    await axios.post(url, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x_access_token': x_access_token
        }
    }).then((res) => {
        console.log(`Clubtv Login: ${username}-${res?.data?.msg}`);
        if (res.data?.result) {
            cache = { data: new Date().toISOString(), action: action, count: count > 4 ? 0 : count + 1} as Cache
            createAndUpdateCache(cache);
            response = { result: true, msg: 'Login criado com sucesso!', data: {user: username, pass: password}};
        }
    }).catch(async (res) => {
        response = { result: false, msg: res?.response.data }
        if (res?.response.status > 499) {
            isLogar = false;
        }
    });

    if (isLogar && !response.result) {
        console.log(`Fazendo login... Islogar:${isLogar} Response:${response}`);
        isLogar = false;
        await createXAcessTokenClubtv();
        await sleep(3000);
        await createWebLoginClub(isLogar);
    }
    return response;
}

export default createWebLoginClub;


