"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveStreams = void 0;
const cacheDB_1 = require("../data/cacheDB");
const getAxios_1 = require("../util/getAxios");
require('dotenv/config');
const getLiveStreams = async (isAdult, isClubtv) => {
    const action = 'get_live_streams';
    const action_adult = 'get_live_adult';
    // const action_club = 'get_live_clubtv';
    // const adultos_clubtv = '12';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    let streamsJson = [];
    if (dataOld.getDay() !== dataNow.getDay()) {
        const provedor = process.env.PROVEDOR_LIVES_ID;
        const category_adult = process.env.CATEGORIA_XXX_LIVE;
        // const live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "live_streams.json"));
        const res = await (0, getAxios_1.getAxiosResult)(action, provedor); //{status: 200, data: live_categorias}
        let streamsAdult = [];
        if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
            res.data.forEach(element => {
                if (element.category_id === category_adult) {
                    element.category_id = "999999";
                    element.stream_id = provedor + element.stream_id;
                    streamsAdult.push(element);
                }
                else {
                    element.category_id = provedor + element.category_id;
                    element.stream_id = provedor + element.stream_id;
                    streamsJson.push(element);
                }
            });
        }
        //Para incluir categorias do servidor club
        // const category_club = ['2480', '4', '42', '488', '489', '490', '1110', '2113', '1048'];
        // const provedor_club = '2';
        // const res_club = await getAxiosResult(action, provedor_club);
        // if (res_club?.status == 200 && res_club?.data.length > 1) {
        //     res_club?.data.forEach(element => {
        //         let category_id: string = element.category_id;
        //         if (category_id === adultos_clubtv) {
        //             element.category_id = "999999";
        //             element.stream_id = provedor_club + element.stream_id;
        //             return streamsAdult.push(element);
        //         }
        //         if (category_club.includes(category_id)) {
        //             element.category_id = provedor_club + element.category_id;
        //             element.stream_id = provedor_club + element.stream_id;
        //             return streamsJson.push(element);
        //         }
        //         const category_name = element.name;
        //         if (category_name?.includes('FHD', (category_name.length - 3)) || category_name?.includes('HD', (category_name.length - 3))) {
        //             element.category_id = '999990';
        //             element.stream_id = provedor_club + element.stream_id;
        //             streamsJson.push(element);
        //         }
        //     });
        // }
        const cache = {
            data: new Date().toISOString(),
            action: action,
        };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        (0, cacheDB_1.createCache)(action, streamsJson);
        (0, cacheDB_1.createCache)(action_adult, streamsAdult);
        //lista para clubtv separada
        // const res_clubtv = await getAxiosResult(action, provedor_club);
        streamsJson = [];
        // if (res_clubtv?.status == 200 && res_clubtv?.data.length > 1) {
        //     res_clubtv.data.forEach(element => {
        //         if (element.category_id === adultos_clubtv) {
        //             return
        //         } else {
        //             element.category_id = provedor_club + element.category_id;
        //             element.stream_id = provedor_club + element.stream_id;
        //             streamsJson.push(element);
        //         }
        //     })
        // }
        // createCache(action_club, streamsJson);
        console.log(`Canais Total: ${streamsJson.length}`);
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    }
    streamsJson = [];
    // if(isClubtv) {
    //     streamsJson = streamsJson.concat(await readCache(action_club));
    // } else {
    streamsJson = streamsJson.concat(await (0, cacheDB_1.readCache)(action));
    // }
    if (isAdult) {
        streamsJson = streamsJson.concat(await (0, cacheDB_1.readCache)(action_adult));
    }
    return streamsJson;
};
exports.getLiveStreams = getLiveStreams;
