"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieInfo = void 0;
const getAxios_1 = require("../util/getAxios");
require('dotenv/config');
const getMovieInfo = async (id) => {
    const provedorId = id.charAt(0);
    const movieId = id.substr(1);
    const res = await (0, getAxios_1.getAxiosResult)('get_vod_info', provedorId, movieId);
    return setProvedorId(res, provedorId);
};
exports.getMovieInfo = getMovieInfo;
const setProvedorId = (res, provedor) => {
    var _a;
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && ((_a = res.data["movie_data"]) === null || _a === void 0 ? void 0 : _a.stream_id)) {
        let id = provedor + res.data["movie_data"].stream_id;
        res.data["movie_data"].stream_id = id;
        return res.data;
    }
};
