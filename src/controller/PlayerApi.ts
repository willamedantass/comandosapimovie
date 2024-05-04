import { isVencimentoController } from "./isVencimentoController";
import { getSeriesCategoryId } from "../api/getSeriesCategoryId";
import { getSeriesCategories } from "../api/getSeriesCategories";
import { getFilmsCategoryId } from "../api/getFilmsCategoryId";
import { getFilmsCategories } from "../api/getFilmsCategories";
import { getLiveCategoryId } from "../api/getLiveCategoryId";
import { getLiveCategories } from "../api/getLiveCategories";
import { getLiveStreams } from "../api/getLiveStreams";
import { getSeriesInfo } from "../api/getSeriesInfo";
import { getMovieInfo } from "../api/getMovieInfo";
import { getEpgShort } from "../api/getEpgShort";
import { getSeries } from "../api/getSeries";
import { getFilms } from "../api/getFilms";
import { getAuth } from "../api/getAuth";
import { loginFindByUser } from "../data/login.service";
import { ILogin } from "../type/login.model";

export const PlayerApi = async (req, res) => {
    const user: string = req.query?.username;
    const password: string = req.query?.password;
    const action: string = req.query?.action;
    const category_id: string = req.query?.category_id;

    try {
        let login: ILogin | null = await loginFindByUser(user);
        if (!login) {
            console.log(`Usuário inválido! Usuário: ${user}`);
            return res.json({ "user_info": { "auth": 0 } });
        }

        if (password !== login.password) {
            console.log(`Senha inválido! Senha: ${password}`);
            return res.json({ "user_info": { "auth": 0 } });
        }

        const isVencido = await isVencimentoController(login);
        if (isVencido) {
            return res.json({ "user_info": { "auth": 0 } });
        }

        if (!action) {
            return res.json(await getAuth(login));
        }

        if (action === 'get_live_categories' && !login.isLive ||
            action === 'get_live_streams' && !login.isLive) {
            return res.json({ "user_info": { "auth": 0 } });
        }

        const isAdult = login?.isAdult ? login.isAdult : false;
        const clubtv: boolean = login?.isClubtv ? login?.isClubtv : false;
        switch (action) {
            case 'get_live_categories':
                return res.json(await getLiveCategories(isAdult, clubtv));
            case 'get_live_streams':
                if (category_id) {
                    return res.json(await getLiveCategoryId(category_id));
                }
                return res.json(await getLiveStreams(isAdult, clubtv));
            case 'get_vod_categories':
                return res.json(await getFilmsCategories(isAdult));
            case 'get_vod_streams':
                if (category_id) {
                    return res.json(await getFilmsCategoryId(category_id));
                }
                return res.json(await getFilms(isAdult));
            case 'get_vod_info':
                const vod_id = req.query.vod_id;
                const result_vod = await getMovieInfo(vod_id);
                if (result_vod && result_vod['movie_data'].stream_id) {
                    return res.json(result_vod);
                }
                return res.status(400).end();
            case 'get_series_categories':
                return res.json(await getSeriesCategories());
            case 'get_series':
                if (category_id) {
                    return res.json(await getSeriesCategoryId(category_id));
                }
                return res.json(await getSeries());
            case 'get_series_info':
                const series_id = req.query.series_id;
                const result_series = await getSeriesInfo(series_id);
                if (result_series && result_series.episodes) {
                    return res.json(result_series);
                }
                return res.status(400).end();
            case 'get_short_epg':
                const stream_id = req.query.stream_id;
                const limit = req.query.limit;
                const url = await getEpgShort(stream_id, limit);
                res.set('location', await getEpgShort(stream_id, limit));
                return res.status(301).send();
            default:
                break;
        }
    } catch (error) {
        res.status(400);
    }
    res.end();
}