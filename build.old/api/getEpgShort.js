"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpgShort = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const getEpgShort = async (stream_id, limit) => {
    const id = stream_id.substring(1);
    const provedor = stream_id.charAt(0);
    const login = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === provedor);
    if (login) {
        return `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_short_epg&stream_id=${id}&limit=${limit}`;
    }
    else {
        return;
    }
};
exports.getEpgShort = getEpgShort;
