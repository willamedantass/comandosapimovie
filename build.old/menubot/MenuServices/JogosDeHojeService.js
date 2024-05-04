"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogosDeHojeService = void 0;
const jsonConverte_1 = require("../../util/jsonConverte");
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const JogosDeHojeService = async () => {
    const pathFileJson = path_1.default.join(__dirname, '..', '..', '..', 'cache', 'JogosDeHoje.json');
    let tabelaJogos = (0, jsonConverte_1.readObject)(pathFileJson);
    let result = { result: false, msg: '' };
    const _expire = new Date();
    _expire.setHours(_expire.getHours() - 1);
    const expire = (tabelaJogos === null || tabelaJogos === void 0 ? void 0 : tabelaJogos.expire) ? new Date(tabelaJogos.expire) : _expire;
    const agora = new Date();
    if (agora > expire) {
        const url = 'https://mantosdofutebol.com.br/guia-de-jogos-tv-hoje-ao-vivo/';
        const res = await axios_1.default.get(url).catch(error => {
            result.msg = `Erro ao gerar dados do site! ${error.message}`;
        });
        if (res === null || res === void 0 ? void 0 : res.data) {
            const cheerio = require('cheerio');
            const $ = cheerio.load(res.data);
            const h3Elements = $('h3'); // Selecionar todos os elementos <h3>
            const pElements = $('p'); // Selecionar todos os elementos <p>
            const jogos = [];
            const canais = [];
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
            let msg = '*Jogos De Hoje:*\n\n';
            for (let i = 0; i < jogos.length; i++) {
                const lines = jogos[i].split(' – ');
                msg += `${lines[0]}\n*${lines[1]}*\nCampeonato: ${lines[2]}`;
                msg += `\n${canais[i]}\n\n`;
            }
            const expire = new Date();
            expire.setHours(agora.getHours() + 2);
            tabelaJogos.expire = expire.toISOString();
            tabelaJogos.tabela = msg;
            (0, jsonConverte_1.writeJSON)(pathFileJson, tabelaJogos);
            result.result = true;
            result.data = msg;
        }
        return result;
    }
    else if (tabelaJogos.tabela) {
        result.result = true;
        result.data = tabelaJogos.tabela;
        return result;
    }
    else {
        result.msg = 'Não conseguimos gerar a tabela de jogos.';
        return result;
    }
};
exports.JogosDeHojeService = JogosDeHojeService;
