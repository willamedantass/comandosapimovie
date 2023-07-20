import { zerarUserFluxo } from "../data/fluxoAcessoDB";
import { zerarLivePass } from "../data/livePassDB";
import { IBotData } from "../Interface/IBotData";

export default async ({ sendText, owner }: IBotData) => {
    if (owner) { 
        zerarUserFluxo();
        zerarLivePass();
        await sendText(true, 'Fluxo zerado com sucesso.');
    }
}