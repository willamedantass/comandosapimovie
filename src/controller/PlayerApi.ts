import { getSeriesCategories } from "../api/getSeriesCategories";
import { getFilmsCategories } from "../api/getFilmsCategories";
import { getLiveCategories } from "../api/getLiveCategories";
import { getLiveStreams } from "../api/getLiveStreams";
import { getSeriesInfo } from "../api/getSeriesInfo";
import { getMovieInfo } from "../api/getMovieInfo";
import { buscarLogin } from "./loginDBController";
import { getSeries } from "../api/getSeries";
import { getFilms } from "../api/getFilms";
import { getAuth } from "../api/getAuth";
import { Login } from "../type/login";
import { getFilmsCategoryId } from "../api/getFilmsCategoryId";
import { getSeriesCategoryId } from "../api/getSeriesCategoryId";
import { getLiveCategoryId } from "../api/getLiveCategoryId";
import { getEpgShort } from "../api/getEpgShort";

export const PlayerApi = async (req, res) => {
    const user: string = req.query.username;
    const password : string = req.query.password;
    const action: string = req.query.action;
    const category_id: string = req.query.category_id;
    //console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    
    let login: Login = buscarLogin(user);
    if (!login) {
        console.log(`Usuário inválido! Usuário: ${user}`);        
        return res.json({"user_info":{"auth":0}});
    }
    if(password !== login.password){
        console.log(`Senha inválido! Senha: ${password}`); 
        return res.json({"user_info":{"auth":0}});
    }

    const agora = new Date();
    const vencimento = new Date(login.vencimento);
    if (agora > vencimento) {
        console.log(`Usuário vencido! Usuário: ${password}`); 
        return res.json(await getAuth(login));
    }

    if (!action) {
        return res.json(await getAuth(login));
    }

    if(action === 'get_live_categories' && !login.live ||
    action === 'get_live_streams' && !login.live){       
        return res.json({"user_info":{"auth":0}});
    }
    
    switch (action) {
        case 'get_live_categories':
            return res.json(await getLiveCategories());
        case 'get_live_streams':
            if(category_id){
                return res.json(await getLiveCategoryId(category_id));
            }
            return res.json(await getLiveStreams());
        case 'get_vod_categories':
            return res.json(await getFilmsCategories());
        case 'get_vod_streams':
            if(category_id){
                return res.json(await getFilmsCategoryId(category_id));                
            }
            return res.json(await getFilms());
        case 'get_vod_info':
            const vod_id = req.query.vod_id;
            return res.json(await getMovieInfo(vod_id));
        case 'get_series_categories':
            return res.json(await getSeriesCategories());
        case 'get_series':
            if(category_id){
                return res.json(await getSeriesCategoryId(category_id));
            }
            return res.json(await getSeries());
        case 'get_series_info':
            const series_id = req.query.series_id;
            return res.json(await getSeriesInfo(series_id));
        case 'get_short_epg':
            const stream_id = req.query.stream_id;
            return res.json(await getEpgShort(stream_id));
        default:
            break;
    }
    res.end();
}