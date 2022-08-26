import path from "path";
import fs from 'fs'
import { postWebCreateLoginController } from "./controller/postWebCreateLoginController";
import { loginController } from "./controller/loginController";
import { gerenteCountLive } from "./controller/urlPlayerController";

export const teste = async () => {
    //await loginController()
    //console.log(await postWebCreateLoginController('teste0404',true,true));
    /*
    const axios = require('axios');
    const pathSession = path.join(__dirname, "..", "cache", "sessionCookie.txt");
    const phpSessid = fs.readFileSync(pathSession, 'utf8');
    let res = await axios.post('https://tigotv.xyz/clients/create/', {
        headers: {
            'content-type': 'multipart/form-data',
            'Cookie': phpSessid
        }
    }).catch(function (error) {
        console.log(error)
    });
    */
     
    

}

teste()


