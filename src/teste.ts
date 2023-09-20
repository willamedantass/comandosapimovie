import { uid } from "uid";
import { mensagem, writeJSON } from "./util/jsonConverte";
import axios from "axios";
import { StringClean } from "./util/stringClean";
import { JogosDeHojeService } from "./menubot/MenuServices/JogosDeHojeService";
import { CinemaSession, CinemasLocais } from "./menubot/MenuServices/CinemasService";


require('dotenv/config');

(async function iniciar() {

    // const url = 'https://api-content.ingresso.com/v0/theaters/city/36/partnership/home'
    // const { data } = await axios.get(url);
    // console.log(data);

    console.log(await JogosDeHojeService());

})();

