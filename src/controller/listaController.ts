import path from "path";
import { User } from "../type/user";
import { readJSON } from "../util/jsonConverte";
require('dotenv/config');
const fs = require('fs');
const pathUsers = path.join(__dirname, "..", "..", "cache", "user.json");

export const listaController = async (req, res) => {
    const provedor = req.params.provedor;
    const login = req.params.login;
    
    if (!login && !provedor) {
        return res.status(400).send('Erro parâmetros não informados!');
    }

    let user: User = readJSON(pathUsers).find(value => value.login === login);
    if (!user) {
        return res.status(400).send('Usuário não encontrado!');
    }

    const today = new Date();
    const vencimento = new Date(user.dataVencimento || today);
    if (today > vencimento) {
        return res.status(400).send('Usuário vencido!')
    }

    const file = path.join(__dirname, "..", "..", "cache", `${user.nome}-${provedor}.m3u`);
    if (!fs.existsSync(file, provedor)) {
        await processLineByLine(file, provedor, user.nome)
    }

    res.download(file);
}

const processLineByLine = async (file, provedor,login) => {
    try {
        const events = require('events');
        const readline = require('readline');
        const serverProxy = `http://${process.env.SERVER_PROXY_DNS}:${process.env.SERVER_PROXY_PORT}`;
        let pathM3U = path.join(__dirname, "..", "..", "cache", "club.m3u");
        switch (provedor) {
            case 'club':
                pathM3U = path.join(__dirname, "..", "..", "cache", "club.m3u");
                break;
            case 'elite':
                pathM3U = path.join(__dirname, "..", "..", "cache", "elite.m3u");
                break;
            case 'tigo':
                pathM3U = path.join(__dirname, "..", "..", "cache", "tigo.m3u");
                break;
            default:
                break;
        }

        let m3u = fs.createWriteStream(file)
        const rl = readline.createInterface({
            input: fs.createReadStream(pathM3U),
            crlfDelay: Infinity
        });

        m3u.write('#EXTM3U\n#EXT-X-SESSION-DATA:DATA-ID="com.xui.1_5_5r2"\n')

        rl.on('line', (line:string) => {
            if(line.includes('group-title="Filmes') || line.includes('group-title="Novelas') || line.includes('group-title="Series')){
                m3u.write(`${line}\r\n`)
            }
            if(line.includes('.mp4')){
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
    } catch (err) {
        console.error(err);
    }
}