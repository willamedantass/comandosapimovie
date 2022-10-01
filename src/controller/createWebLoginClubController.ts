import { getRandomString } from "../util/getRandomString";
import { readJSON, writeJSON } from "../util/jsonConverte";
import sleep from "../util/sleep";
import path from "path";
require('dotenv/config');
const pathSessionClub = path.join(__dirname, "..", "..", "cache", "session_club.json");

interface Response {
    result: boolean,
    msg: string,
    user?: string,
    pass?: string
}

const createWebLoginClub = async (isLogar: boolean): Promise<Response> => {

    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const urlClubApi = process.env.URL_CLUBTV_API;
    const x_access_token = readJSON(pathSessionClub)?.token || '000000000';
    const url: string = `${urlClubApi}/listas/teste`;
    const username: string = `meuteste${getRandomNumber()}`;
    const password: string = (getRandomString() + '5');
    let response: Response = { result: false, msg: '' };
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
        if (res.data?.result) {
            response = { result: true, msg: 'Login criado com sucesso!', user: username, pass: password };
        }
    }).catch(async (res) => {
        response = { result: false, msg: res?.response.data }
    });

    if (isLogar && !response.result) {
        console.log('Fazendo login...');
        isLogar = false;
        await loginCache();
        await sleep(2000);
        await createWebLoginClub(isLogar);
    }
    return response;
}

const loginCache = async () => {
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const url_club_api = process.env.URL_CLUBTV_API;
    const username = process.env.LOGIN_CLUBTV_PAINELWEB_USUARIO;
    const password = process.env.LOGIN_CLUBTV_PAINELWEB_SENHA;
    const chave_api = process.env.CHAVE_ANTICAPCHA_API;
    const dataSiteKeyCapcha = process.env.DATA_SITEKEY_RECAPCHA;
    let token_recapcha;

    //Anti Capcha
    const ac = require("@antiadmin/anticaptchaofficial");
    ac.setAPIKey(chave_api);
    ac.setSoftId(0);
    await ac.solveRecaptchaV2Proxyless(url_club_api, dataSiteKeyCapcha)
        .then(gresponse => {
            token_recapcha = gresponse;
            console.log(gresponse);

        })
        .catch(error => console.log('Não conseguiu resolver o captcha, erro:' + error));

    form_data.append('username', username);
    form_data.append('password', password);
    form_data.append('g-recaptcha-response', token_recapcha);
    await sleep(3000);
    await axios.post(`${url_club_api}/login`, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
        }
    }).then((res) => {
        if (res.data?.result) {
            writeJSON(pathSessionClub, { token: res.data.token });
        }
    }).catch((res) => {
        console.log('Não foi possível fazer login. Mensagem de erro:', res?.response.data.msg);
    });
}

const getRandomNumber = (): string => {
    let min = Math.ceil(100);
    let max = Math.floor(999);
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export default createWebLoginClub;


