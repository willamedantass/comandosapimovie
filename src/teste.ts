import { createLoginAPI, deleteLoginAPI, deleteLoginOPainel } from "./controller/LoginsWebOPainelController";
import { readUserFluxo, zerarUserFluxo } from "./data/fluxoAcessoDB";
import { unusedUserLivePass, zerarLivePass } from "./data/livePassDB";
import { livePass } from "./type/livePass";
import { userFluxoAcesso } from "./type/userFluxoAcesso";
require('dotenv/config')

const teste = async () => {
    console.log(unusedUserLivePass(true));
}

teste()
