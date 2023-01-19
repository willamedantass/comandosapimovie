import { writeJSON } from "../util/jsonConverte";
import path from "path";
const pathPhpSessid = path.join(__dirname, "..", "..", "cache", "phpsessid.json");
require('dotenv/config')

export const logarKOfficeController = async () => {
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    form_data.append('username', process.env.LOGIN_PAINELWEB_USUARIO);
    form_data.append('password', process.env.LOGIN_PAINELWEB_SENHA);
    form_data.append('try_login', 1);
    const url = `${process.env.URL_PAINELWEB_KOFFICE}/login/`;
    let res = await axios.post(url,
        form_data, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                'content-type': 'multipart/form-data'
            }
    });

    if (res?.status > 399) {
        return console.log(`Erro ao fazer login no painel web! Erro ${res.data}`);
    }

    if (res?.status === 200) {
        console.log('Login realizado com sucesso!');
        const sessionCookie: string = res.headers['set-cookie'][0].split(';')[0]
        writeJSON(pathPhpSessid, { token: sessionCookie });
    }
}