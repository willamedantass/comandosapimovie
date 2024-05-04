"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerApi = void 0;
const isVencimentoController_1 = require("./isVencimentoController");
const getSeriesCategoryId_1 = require("../api/getSeriesCategoryId");
const getSeriesCategories_1 = require("../api/getSeriesCategories");
const getFilmsCategoryId_1 = require("../api/getFilmsCategoryId");
const getFilmsCategories_1 = require("../api/getFilmsCategories");
const getLiveCategoryId_1 = require("../api/getLiveCategoryId");
const getLiveCategories_1 = require("../api/getLiveCategories");
const loginDB_1 = require("../data/loginDB");
const getLiveStreams_1 = require("../api/getLiveStreams");
const getSeriesInfo_1 = require("../api/getSeriesInfo");
const getMovieInfo_1 = require("../api/getMovieInfo");
const getEpgShort_1 = require("../api/getEpgShort");
const getSeries_1 = require("../api/getSeries");
const getFilms_1 = require("../api/getFilms");
const getAuth_1 = require("../api/getAuth");
const PlayerApi = async (req, res) => {
    const user = req.query.username;
    const password = req.query.password;
    const action = req.query.action;
    const category_id = req.query.category_id;
    let login = (0, loginDB_1.searchLoginPorUsername)(user);
    if (!login) {
        console.log(`Usuário inválido! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }
    if (password !== login.password) {
        console.log(`Senha inválido! Senha: ${password}`);
        return res.json({ "user_info": { "auth": 0 } });
    }
    const isVencido = await (0, isVencimentoController_1.isVencimentoController)(login);
    if (isVencido) {
        return res.json({ "user_info": { "auth": 0 } });
    }
    if (!action) {
        return res.json(await (0, getAuth_1.getAuth)(login));
    }
    if (action === 'get_live_categories' && !login.isLive ||
        action === 'get_live_streams' && !login.isLive) {
        return res.json({ "user_info": { "auth": 0 } });
    }
    const isAdult = (login === null || login === void 0 ? void 0 : login.isAdult) ? login.isAdult : false;
    const clubtv = (login === null || login === void 0 ? void 0 : login.isClubtv) ? login === null || login === void 0 ? void 0 : login.isClubtv : false;
    switch (action) {
        case 'get_live_categories':
            return res.json(await (0, getLiveCategories_1.getLiveCategories)(isAdult, clubtv));
        case 'get_live_streams':
            if (category_id) {
                return res.json(await (0, getLiveCategoryId_1.getLiveCategoryId)(category_id));
            }
            return res.json(await (0, getLiveStreams_1.getLiveStreams)(isAdult, clubtv));
        case 'get_vod_categories':
            return res.json(await (0, getFilmsCategories_1.getFilmsCategories)(isAdult));
        case 'get_vod_streams':
            if (category_id) {
                return res.json(await (0, getFilmsCategoryId_1.getFilmsCategoryId)(category_id));
            }
            return res.json(await (0, getFilms_1.getFilms)(isAdult));
        case 'get_vod_info':
            const vod_id = req.query.vod_id;
            const result_vod = await (0, getMovieInfo_1.getMovieInfo)(vod_id);
            if (result_vod && result_vod['movie_data'].stream_id) {
                return res.json(result_vod);
            }
            return res.status(400).end();
        case 'get_series_categories':
            return res.json(await (0, getSeriesCategories_1.getSeriesCategories)());
        case 'get_series':
            if (category_id) {
                return res.json(await (0, getSeriesCategoryId_1.getSeriesCategoryId)(category_id));
            }
            return res.json(await (0, getSeries_1.getSeries)());
        case 'get_series_info':
            const series_id = req.query.series_id;
            const result_series = await (0, getSeriesInfo_1.getSeriesInfo)(series_id);
            if (result_series && result_series.episodes) {
                return res.json(result_series);
            }
            return res.status(400).end();
        case 'get_short_epg':
            const stream_id = req.query.stream_id;
            const limit = req.query.limit;
            const url = await (0, getEpgShort_1.getEpgShort)(stream_id, limit);
            res.set('location', await (0, getEpgShort_1.getEpgShort)(stream_id, limit));
            return res.status(301).send();
        default:
            break;
    }
    res.end();
};
exports.PlayerApi = PlayerApi;
