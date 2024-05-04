"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinemaSession = exports.CinemasLocais = void 0;
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const jsonConverte_1 = require("../../util/jsonConverte");
const CinemasLocais = async () => {
    const pathFileJson = path_1.default.join(__dirname, '..', '..', '..', 'cache', 'CinemasLocais.json');
    let cinemasLocais = (0, jsonConverte_1.readObject)(pathFileJson);
    let result = { result: false, msg: '' };
    const _expire = new Date();
    _expire.setHours(_expire.getHours() - 1);
    const expire = (cinemasLocais === null || cinemasLocais === void 0 ? void 0 : cinemasLocais.expire) ? new Date(cinemasLocais.expire) : _expire;
    const agora = new Date();
    if (agora > expire) {
        const url = 'https://api-content.ingresso.com/v0/theaters/city/36/partnership/home';
        const res = await axios_1.default.get(url).catch(error => {
            result.msg = `Erro ao gerar dados da api! ${error.message}`;
        });
        if (res === null || res === void 0 ? void 0 : res.data) {
            const locais = [];
            res.data.items.forEach(element => {
                locais.push({
                    id: element.id,
                    name: element.name,
                    address: element.address,
                    totalRooms: element.totalRooms
                });
            });
            let menu = '*Selecione um local*:\n';
            locais.forEach((local, index) => {
                menu += `${index + 1} - *${local.name}*\n${local.address}\nSalas Disponíveis: ${local.totalRooms}\n▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;
            });
            menu += '\n Digite o número do local ou Voltar.';
            cinemasLocais.locais = locais;
            cinemasLocais.menu = menu;
            const expire = new Date();
            expire.setHours(agora.getHours() + 2);
            cinemasLocais.expire = expire.toISOString();
            (0, jsonConverte_1.writeJSON)(pathFileJson, cinemasLocais);
            result.result = true;
            result.data = cinemasLocais;
        }
        return result;
    }
    else if (cinemasLocais.locais) {
        result.result = true;
        result.data = cinemasLocais;
        return result;
    }
    else {
        result.msg = 'Não conseguimos gerar a tabela de jogos.';
        return result;
    }
};
exports.CinemasLocais = CinemasLocais;
const CinemaSession = async (id) => {
    let result = { result: false, msg: '' };
    const url = `https://api-content.ingresso.com/v0/sessions/city/36/theater/${id}/partnership/home/groupBy/sessionType?date=${DataFormatada()}`;
    const res = await axios_1.default.get(url).catch(error => {
        result.msg = `Erro ao gerar dados da api! ${error.message}`;
    });
    // console.log(res?.data[0].movies[1].sessionTypes[1]);
    if ((res === null || res === void 0 ? void 0 : res.data) && res.data.length > 0) {
        const movies = res.data[0].movies;
        const session = [];
        movies.forEach(movie => {
            var _a;
            const image = movie.images[0].url;
            let msg = '';
            let horarios = '\n▬▬▬▬▬▬▬▬▬▬▬▬▬\n           *Horários/Preços*\n▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
            msg += `*${movie.title}*\nDuração: ${movie.duration}m\nGênero: ${movie.genres.toString()}\nClassificação: ${movie.contentRating}\nTrailer: ${(_a = movie.trailers[0]) === null || _a === void 0 ? void 0 : _a.url}`;
            movie.sessionTypes.forEach(session => {
                horarios += `Tipo: ${session.type.toString()}\n`;
                session.sessions.forEach(ss => {
                    ;
                    var moedaFormatada = ss.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    horarios += `Sessão: ${ss.time} - Preço: ${moedaFormatada}\n`;
                });
            });
            msg += horarios;
            session.push({ image, msg });
        });
        result.result = true;
        result.data = session;
    }
    return result;
};
exports.CinemaSession = CinemaSession;
const DataFormatada = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};
