import { readObject, writeJSON } from "../../util/jsonConverte";
import { Result } from "../../type/result";
import axios from "axios";
import path from "path";

type Local = {
    id: string;
    name: string;
    address: string;
    totalRooms: number;
}

type Session = {
    image: string;
    msg: string;
}

type CinemasLocais = {
    expire: string,
    locais: Local[],
    menu: string
}

export const CinemasLocais = async (): Promise<Result> => {

    const pathFileJson = path.join(__dirname, '..', '..', '..', 'cache', 'CinemasLocais.json');
    let cinemasLocais: CinemasLocais = readObject(pathFileJson);

    let result: Result = { result: false, msg: '' }
    const _expire = new Date();
    _expire.setHours(_expire.getHours() - 1);
    const expire = cinemasLocais?.expire ? new Date(cinemasLocais.expire) : _expire;
    const agora = new Date();

    if (agora > expire) {
        const url: string = 'https://api-content.ingresso.com/v0/theaters/city/36/partnership/home';
        const res = await axios.get(url).catch(error => {
            result.msg = `Erro ao gerar dados da api! ${error.message}`;
        });

        if (res?.data) {
            const locais: Local[] = [];
            res.data.items.forEach(element => {
                locais.push({
                    id: element.id,
                    name: element.name,
                    address: element.address,
                    totalRooms: element.totalRooms
                });
            });

            let menu: string = '*Selecione um local*:\n';
            locais.forEach((local, index) => {
                menu += `${index + 1} - *${local.name}*\n${local.address}\nSalas Disponíveis: ${local.totalRooms}\n▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
            });
            menu += '\n Digite o número do local ou Voltar.'

            cinemasLocais.locais = locais;
            cinemasLocais.menu = menu;
            const expire = new Date();
            expire.setHours(agora.getHours() + 2);
            cinemasLocais.expire = expire.toISOString();
            writeJSON(pathFileJson, cinemasLocais);
            result.result = true;
            result.data = cinemasLocais;
        }
        return result
    } else if (cinemasLocais.locais) {
        result.result = true;
        result.data = cinemasLocais;
        return result;
    } else {
        result.msg = 'Não conseguimos gerar a tabela de jogos.';
        return result;
    }
}

export const CinemaSession = async (id: string): Promise<Result> => {

    let result: Result = { result: false, msg: '' }
    const url: string = `https://api-content.ingresso.com/v0/sessions/city/36/theater/${id}/partnership/home/groupBy/sessionType?date=${DataFormatada()}`;
    const res = await axios.get(url).catch(error => {
        result.msg = `Erro ao gerar dados da api! ${error.message}`;
    });

    // console.log(res?.data[0].movies[1].sessionTypes[1]);

    if (res?.data && res.data.length > 0) {
        const movies = res.data[0].movies;
        const session: Session[] = []
        movies.forEach(movie => {
            const image = movie.images[0].url;
            let msg: string = '';
            let horarios: string = '\n▬▬▬▬▬▬▬▬▬▬▬▬▬\n           *Horários/Preços*\n▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
            msg += `*${movie.title}*\nDuração: ${movie.duration}m\nGênero: ${movie.genres.toString()}\nClassificação: ${movie.contentRating}\nTrailer: ${movie.trailers[0]?.url}`;
            movie.sessionTypes.forEach(session => {
                horarios += `Tipo: ${session.type.toString()}\n`
                session.sessions.forEach(ss => {;
                    var moedaFormatada = ss.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    horarios += `Sessão: ${ss.time} - Preço: ${moedaFormatada}\n`;
                });
            });
            msg += horarios;
            session.push({image, msg});
        });
        result.result = true;
        result.data = session;
    }
    return result
}

const DataFormatada = (): string => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;

}