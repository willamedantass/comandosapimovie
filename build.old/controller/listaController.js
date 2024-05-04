"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listaController = void 0;
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require('dotenv/config');
const pathUsers = path_1.default.join(__dirname, "..", "..", "cache", "login.json");
const listaController = async (req, res) => {
    const provedor = req.params.provedor;
    const login_req = req.params.login;
    if (!login_req && !provedor) {
        return res.status(400).send('Erro parâmetros não informados!');
    }
    let login = (0, jsonConverte_1.readJSON)(pathUsers).find(value => value.user === login);
    if (!login) {
        return res.status(400).send('Usuário não encontrado!');
    }
    const today = new Date();
    const vencimento = new Date(login.vencimento || today);
    if (today > vencimento) {
        return res.status(400).send('Usuário vencido!');
    }
    const file = path_1.default.join(__dirname, "..", "..", "cache", `${login.user}-${provedor}.m3u`);
    if (!fs_1.default.existsSync(file)) {
        await processLineByLine(file, provedor, login.user);
    }
    res.download(file);
};
exports.listaController = listaController;
const processLineByLine = async (file, provedor, login) => {
    try {
        const events = require('events');
        const readline = require('readline');
        const serverProxy = `http://${process.env.SERVER_PROXY_DNS}:${process.env.SERVER_PROXY_PORT}`;
        let pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "club.m3u");
        switch (provedor) {
            case 'club':
                pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "club.m3u");
                break;
            case 'elite':
                pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "elite.m3u");
                break;
            case 'tigo':
                pathM3U = path_1.default.join(__dirname, "..", "..", "cache", "tigo.m3u");
                break;
            default:
                break;
        }
        let m3u = fs_1.default.createWriteStream(file);
        const rl = readline.createInterface({
            input: fs_1.default.createReadStream(pathM3U),
            crlfDelay: Infinity
        });
        m3u.write('#EXTM3U\n#EXT-X-SESSION-DATA:DATA-ID="com.xui.1_5_5r2"\n');
        rl.on('line', (line) => {
            if (line.includes('group-title="Filmes') || line.includes('group-title="Novelas') || line.includes('group-title="Series')) {
                m3u.write(`${line}\r\n`);
            }
            if (line.includes('.mp4')) {
                const url = new URL(line);
                const urlSplit = url.pathname.split('/');
                m3u.write(`${serverProxy}/url/${provedor}/${urlSplit[1]}/${login}/${urlSplit[urlSplit.length - 1]}\r\n`);
            }
        });
        await events.once(rl, 'close');
        await m3u.end();
        console.log('Reading file line by line with readline done.');
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    }
    catch (err) {
        console.error(err);
    }
};
