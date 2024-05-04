"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveCategoryId = void 0;
const getAxios_1 = require("../util/getAxios");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
const getLiveCategoryId = async (category_id) => {
    var _a;
    const provedor = category_id.charAt(0);
    const id = category_id.substring(1);
    // if(id === '99990'){
    //     return readJSON(path.join(__dirname, "..", "..", "cache", "get_live_clubtv.json"));
    // }
    if (provedor === '9') {
        return (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "get_live_adult.json"));
    }
    // let live_categorias;
    // if(provedor === '5'){
    //     live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "get_live_streams.json")); //await getAxiosResult('get_live_streams', provedor,id);  
    // }
    // if(provedor === '2'){
    //     live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "get_live_clubtv.json")); //await getAxiosResult('get_live_streams', provedor,id);  
    // }
    let streamsJson = [];
    // let res = {status: 200, data: live_categorias} 
    const res = await (0, getAxios_1.getAxiosResult)('get_live_streams', provedor, id);
    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.length) > 1) {
        res.data.forEach(element => {
            if (id == element.category_id) {
                element.stream_id = provedor + element.stream_id;
                streamsJson.push(element);
            }
        });
    }
    return streamsJson;
};
exports.getLiveCategoryId = getLiveCategoryId;
