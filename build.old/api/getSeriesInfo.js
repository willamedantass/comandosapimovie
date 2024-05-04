"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesInfo = void 0;
const getAxios_1 = require("../util/getAxios");
require('dotenv/config');
const getSeriesInfo = async (idSeries) => {
    const provedorId = idSeries.charAt(0);
    const serieId = idSeries.substr(1);
    let res = await (0, getAxios_1.getAxiosResult)('get_series_info', provedorId, serieId);
    return setProvedorId(res, provedorId);
};
exports.getSeriesInfo = getSeriesInfo;
const setProvedorId = (res, provedor) => {
    if (res && res.data.episodes) {
        Object.keys(res.data.episodes).forEach(key => {
            const value = res.data.episodes[key];
            value.forEach((_, index) => {
                const id = res.data.episodes[key][index].id;
                res.data.episodes[key][index].id = `${provedor}${id}`;
            });
        });
        return res.data;
    }
};
