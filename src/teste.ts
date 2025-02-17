import { sendPresence } from "./util/evolution";



require('dotenv/config');

(async function iniciar() {
    // sendText("558588199556@s.whatsapp.net",
    //     "Vejo que você é novo por aqui! Para oferecer um atendimento personalizado, posso saber seu nome e sobrenome? 😊"
    // );`
    await sendPresence("composing","558588199556@s.whatsapp.net", 1200)


})();

