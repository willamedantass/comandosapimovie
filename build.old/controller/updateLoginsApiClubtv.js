"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoginsApiClubtv = void 0;
const fluxoAcessoDB_1 = require("../data/fluxoAcessoDB");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
const updateLoginsApiClubtv = async () => {
    var _a, _b, _c;
    const axios = require('axios');
    const res = await axios.post(`${process.env.SERVER_API}/alllogins`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS }
    }).catch(e => console.log(e));
    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.result) && ((_c = (_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "live_pass.json");
        console.log(res.data.msg);
        (0, jsonConverte_1.writeJSON)(pathJson, res.data.data);
        (0, fluxoAcessoDB_1.zerarUserFluxo)();
    }
};
exports.updateLoginsApiClubtv = updateLoginsApiClubtv;
