"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveCategories = void 0;
const cacheDB_1 = require("../data/cacheDB");
const getAxios_1 = require("../util/getAxios");
require('dotenv/config');
const getLiveCategories = async (isAdult, isClubtv) => {
    let categorias;
    // const action_clubtv = 'get_live_categories_clubtv';
    const action = 'get_live_categories';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    const element_adult = { "category_id": "999999", "category_name": "CANAIS | CANAIS ADULTO", "parent_id": 0 };
    if (dataOld.getDay() !== dataNow.getDay()) {
        // const element_channel_clubtv = { "category_id": "999990", "category_name": "CLUBTV | FHD/HD", "parent_id": 0 };
        const provedor = process.env.PROVEDOR_LIVES_ID;
        const category_adult = process.env.CATEGORIA_XXX_LIVE;
        categorias = [];
        // const live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "live_categorias.json"));
        let res = await (0, getAxios_1.getAxiosResult)(action, provedor); //{status: 200, data: live_categorias}
        if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
            res === null || res === void 0 ? void 0 : res.data.forEach(element => {
                const category_id = element.category_id;
                if (category_id === category_adult) {
                    return;
                }
                element.category_id = provedor + category_id;
                categorias.push(element);
            });
        }
        //Incluindo categoria FHD/HD do servidor club
        // categorias.push(element_channel_clubtv);
        //Para incluir algumas categorias do servidor club
        // const category_club = ['2480', '4', '42', '488', '489', '490', '1110', '2113', '1048'];
        // const provedor_club = '2';
        // const res_club = await getAxiosResult(action, provedor_club);
        // if (res_club?.status == 200 && res_club?.data.length > 1) {
        //     res_club?.data.forEach(element => {
        //         let category_id: string = element.category_id;
        //         if (category_club.includes(category_id)) {
        //             element.category_id = provedor_club + category_id;
        //             element.category_name = element.category_name.replace('Canais', 'ClubTv');
        //             categorias.push(element);
        //         }
        //     });
        // }
        let cache = {
            data: new Date().toISOString(),
            action: action,
        };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        (0, cacheDB_1.createCache)(action, categorias);
        //***listando os canais da clubtv***
        categorias = [];
        res = await (0, getAxios_1.getAxiosResult)(action, '2');
        if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
            res === null || res === void 0 ? void 0 : res.data.forEach(element => {
                const category_id = element.category_id;
                if (category_id === '12') {
                    return;
                }
                element.category_id = '2' + category_id;
                categorias.push(element);
            });
        }
        cache = {
            data: new Date().toISOString(),
            action: action,
        };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        // updateLoginsApiClubtv();
        // createCache(action_clubtv, categorias);
    }
    categorias = [];
    // if (isClubtv) {
    //     categorias = categorias.concat(await readCache(action_clubtv));
    // } else {
    categorias = categorias.concat(await (0, cacheDB_1.readCache)(action));
    // }
    if (isAdult) {
        categorias.push(element_adult);
    }
    return categorias;
};
exports.getLiveCategories = getLiveCategories;
