import path from "path";
import { Cache } from "../type/cache";
import { readJSON } from "../util/jsonConverte";
import { createAndUpdateCache, createCache, readOption } from "../data/cacheDB";
require('dotenv/config');

export const createCacheLoginsClubtv = async () => {

    const action = 'club_logins_ativos';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();

    if (dataOld.getDay() !== dataNow.getDay()) {
        const axios = require('axios');
        const urlClubApi = process.env.URL_CLUBTV_API;
        const pathSessionClub = path.join(__dirname, "..", "..", "cache", "session_club.json");
        const x_access_token = readJSON(pathSessionClub)?.token || '000000000';
        const url: string = `${urlClubApi}/listas/minhas`;
        let data: any[] = [];
        const logins: any[] = [];

        await axios.post(url, null, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x_access_token': x_access_token
            }
        }).then((res) => {
            data = res?.data.data;
        }).catch(async (res) => {
            console.log(`Erro no processo de criação do cache de logins do clubtv: ${res}`);
        });

        for (let login of data) {
            const url_info = `${urlClubApi}/listas/${login.id}/info`;
            await axios.get(url_info, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x_access_token': x_access_token
                }
            }).then((res) => {
                if (res?.data.result) {
                    logins.push({ user: res.data.data.username, password: res.data.data.password });
                }
            }).catch(async (res) => {
                console.log(`Erro no processo de criação do cache de logins do clubtv: ${res}`);
            });
        }

        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,

        }
        createAndUpdateCache(cache);
        createCache(action, logins);
        console.log('Sucesso na criação da listagem de logins do clubtv!');
    }
}