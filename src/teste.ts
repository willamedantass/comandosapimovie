import { PixController } from "./controller/PixController";
import { LoginController } from "./controller/loginController";
import { buscarUser } from "./data/userDB";
import { StringClean } from "./util/stringClean";
require('dotenv/config');

(async function iniciar() {

    const options = { timeZone: 'America/Sao_Paulo', hour12: false }
    const vencimento = new Date().toISOString();
    console.log(new Date(vencimento).toLocaleString('pt-br', options));
    

    //   key: {
    //     remoteJid: '558588199556@s.whatsapp.net',
    //     fromMe: false,
    //     id: 'E980329AC3652E0EC199FCB7245C0A48',
    //     participant: undefined
    //   },
    //   messageTimestamp: 1693232788,
    //   pushName: 'Will',
    //   broadcast: false,
    //   message: Message {
    //     conversation: 'Oi',
    //     messageContextInfo: MessageContextInfo {
    //       deviceListMetadata: [DeviceListMetadata],
    //       deviceListMetadataVersion: 2
    //     }
    //   }
    // }


})();

