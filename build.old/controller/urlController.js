"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlController = void 0;
const path_1 = __importDefault(require("path"));
const jsonConverte_1 = require("../util/jsonConverte");
require('dotenv/config');
const urlController = async (req, res) => {
    const pathLogins = path_1.default.join(__dirname, "..", "..", "cache", "login.json");
    const provedor = req.params.provedor;
    const media = req.params.media;
    const login = req.params.login;
    const video = req.params.video;
    if (!login && !video && !provedor && !media) {
        return res.status(400).send('Erro parâmetros não informados!');
    }
    let Login = (0, jsonConverte_1.readJSON)(pathLogins).find(value => value.user === login);
    if (!login) {
        return res.status(400).send('Usuário não encontrado!');
    }
    const today = new Date();
    const vencimento = new Date(login.vencimento || today);
    if (today > vencimento) {
        return res.status(400).send('Usuário vencido!');
    }
    try {
        let pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "club.m3u");
        let provedorDNS = '';
        switch (provedor) {
            case 'club':
                pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "club.m3u");
                provedorDNS = process.env.SERVER_DNS_CLUB || '';
                break;
            case 'elite':
                pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "elite.m3u");
                provedorDNS = process.env.SERVER_DNS_ELITE || '';
                break;
            case 'tigo':
                pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "tigo.m3u");
                provedorDNS = process.env.SERVER_DNS_TIGO || '';
                break;
            default:
                break;
        }
        const clubPass = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "club_pass.json"));
        const login = clubPass[Math.floor(Math.random() * clubPass.length)];
        const link = `${provedorDNS}/${media}/${login["user"]}/${login["password"]}/${video}`;
        console.log(link);
        res.set('location', link);
        res.status(301).send();
    }
    catch (error) {
        res.status(400).send(error);
    }
};
exports.urlController = urlController;
const exemploRedirect = async () => {
    const axios = require('axios');
    let auth = await axios.get('link', {
        maxRedirects: 0,
        validateStatus: null
    });
    let videoLink = await axios.get(auth.headers.location, {
        maxRedirects: 0,
        validateStatus: null
    });
};
