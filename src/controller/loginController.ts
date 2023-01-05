import fs from 'fs'
import path from "path";

export const loginController = async () => {
    const axios = require('axios');
    const FormData = require('form-data');
    const pathSession = path.join(__dirname, "..","..", "cache", "sessionCookie.txt");
    const form_data = new FormData();
    form_data.append('username', process.env.LOGIN_PAINELWEB_USUARIO);
    form_data.append('password', process.env.LOGIN_PAINELWEB_SENHA);
    form_data.append('try_login', 1);
    let res = await axios.post("https://tigotv.xyz/login/",
        form_data, { headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            'content-type': 'multipart/form-data'
        }  });
        
    if(res.status > 399){
       return console.log(`Erro ao fazer login no painel web! Erro ${res.data}`);        
    }

    let sessionCookie: string = res.headers['set-cookie'][0].split(';')[0]
    if (fs.existsSync(pathSession)) {
        fs.unlinkSync(pathSession);
        fs.writeFileSync(pathSession, sessionCookie);
    } else {
        fs.writeFileSync(pathSession, sessionCookie);
    }
}