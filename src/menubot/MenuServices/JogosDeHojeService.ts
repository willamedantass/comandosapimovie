import { readObject, writeJSON } from "../../util/jsonConverte";
import { Result } from "../../type/result";
import axios from "axios";
import path from "path";

type TabelaJojos = {
    expire: string,
    tabela: string
}

export const JogosDeHojeService = async (): Promise<Result> => {

    const pathFileJson = path.join(__dirname, '..', '..', '..', 'cache', 'JogosDeHoje.json');
    let tabelaJogos: TabelaJojos = readObject(pathFileJson);

    let result: Result = { result: false, msg: '' }
    const _expire = new Date();
    _expire.setHours(_expire.getHours()-1);
    const expire = tabelaJogos?.expire ? new Date(tabelaJogos.expire) : _expire;
    const agora = new Date();
    
    if (agora > expire) {
        const url: string = 'https://mantosdofutebol.com.br/guia-de-jogos-tv-hoje-ao-vivo/';
        const res = await axios.get(url).catch(error => {
            result.msg = `Erro ao gerar dados do site! ${error.message}`;
        });

        if (res?.data) {
            const cheerio = require('cheerio');
            const $ = cheerio.load(res.data);

            const h3Elements = $('h3'); // Selecionar todos os elementos <h3>
            const pElements = $('p'); // Selecionar todos os elementos <p>

            const jogos: string[] = []
            const canais: string[] = []

            h3Elements.each((_, element) => {
                const text = $(element).text();
                if (/^\d{1,2}h\d{2} –/.test(text)) {
                    jogos.push(text);
                }
            });

            pElements.each((_, element) => {
                const text = $(element).text();
                if (text.startsWith('Canais') || text.startsWith('canais')) {
                    canais.push(text);
                }
            });

            let msg = '*Jogos De Hoje:*\n\n'
            for (let i = 0; i < jogos.length; i++) {
                const lines: string[] = jogos[i].split(' – ');
                msg += `${lines[0]}\n*${lines[1]}*\nCampeonato: ${lines[2]}` 
                msg += `\n${canais[i]}\n\n`
                
            }
            
            const expire = new Date();
            expire.setHours(agora.getHours()+2);
            tabelaJogos.expire = expire.toISOString();
            tabelaJogos.tabela = msg;
            writeJSON(pathFileJson, tabelaJogos);
            result.result = true;
            result.data = msg;
        }
        return result
    } else if (tabelaJogos.tabela) {
        result.result = true;
        result.data = tabelaJogos.tabela;
        return result;
    } else {
        result.msg = 'Não conseguimos gerar a tabela de jogos.';
        return result;
    }
}