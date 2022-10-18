import path from "path";
import fs from 'fs'
import { loginController } from "./loginController";
import { getRandomString } from "../util/getRandomString";

export const postWebCreateLoginController = async (user: string, isTrial: boolean, isLogar: boolean) => {
    const axios = require('axios');
    const FormData = require('form-data');
    const form_data = new FormData();
    const pathSession = path.join(__dirname, "..", "..", "cache", "sessionCookie.txt");
    const phpSessid = fs.readFileSync(pathSession, 'utf8');

    let url: string = '';
    const username: string = `meuteste${getRandomNumber()}`;
    const password: string = getRandomString();

    if (isTrial) {
        form_data.append('create_custom_test', 1);
        form_data.append('username', username); //'meuteste21'
        form_data.append('password', password);
        url = 'https://tigotv.xyz/test/';
    } else {
        form_data.append('action', 'create_client');
        form_data.append('username', user);
        form_data.append('password', password);
        form_data.append('duracao', '1');
        form_data.append('acess', '1');
        form_data.append('cred', '1');
        url = 'https://tigotv.xyz/clients/create/'
    }

    form_data.append('email', '');
    form_data.append('phone_number', '');
    form_data.append('reseller_notes', '');
    form_data.append('bouquets[]', 81);
    form_data.append('bouquets[]', 85);
    form_data.append('bouquets[]', 86);
    form_data.append('bouquets[]', 87);
    form_data.append('bouquets[]', 89);
    form_data.append('bouquets[]', 109);
    form_data.append('bouquets[]', 110);
    form_data.append('bouquets[]', 111);

    let res = await axios.post(url, form_data, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'multipart/form-data',
            'Cookie': phpSessid
        }
    }).catch(function (error) {
        console.log(error)
    });

    
    if (res?.status == 200 && res.data?.includes('https://tigotv.xyz/login/') && isLogar) {
        console.log('Fazendo login...');
        isLogar = false;
        await loginController();
        return postWebCreateLoginController(user, isTrial, false);
    }

    const result: string = res['request'].path
    let idLogin = '';
    if (result.includes('client_id')) {
        idLogin = result.split('=')[1];
    }

    if (idLogin) {
        return { result: true, msg: 'Login criado com sucesso!', id: idLogin, user: username, pass: password };
    }

    return { result: false, msg: 'Erro ao gerar login!' };
}

const getRandomNumber = (): string => {
    let min = Math.ceil(100);
    let max = Math.floor(999);
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}