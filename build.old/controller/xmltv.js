"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmltv = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const xmltv = async (req, res) => {
    const idProvedor = process.env.PROVEDOR_LIVES_ID;
    const acesso = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idProvedor);
    const link = `${acesso === null || acesso === void 0 ? void 0 : acesso.dns}/xmltv.php?username=${acesso === null || acesso === void 0 ? void 0 : acesso.user}&password=${acesso === null || acesso === void 0 ? void 0 : acesso.password}`;
    console.log('Carregado epg');
    res.set('location', link);
    res.status(301).send();
};
exports.xmltv = xmltv;
