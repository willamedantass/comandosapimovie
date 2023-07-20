import path from "path";
import { writeJSON } from "../util/jsonConverte";
import sleep from "../util/sleep";
import { createCacheLoginsClubtv } from "./createCacheLoginsClubtv";
import { deletarLoginsExpirados } from "./deletarLoginsExpiradosClubtv";

export const createXAcessTokenClubtv = async () => {
    const pathSessionClub = path.join(__dirname, "..", "..", "cache", "session_club.json");
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

    createCacheLoginsClubtv();
    deletarLoginsExpirados();
}
