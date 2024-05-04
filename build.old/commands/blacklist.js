"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
exports.default = async ({ reply, owner, remoteJid }) => {
    if (owner) {
        const pathBlackList = path_1.default.join(__dirname, '..', '..', 'cache', 'blacklist.json');
        let contato = (0, jsonConverte_1.readJSON)(pathBlackList).find(remoJid => remoJid === remoteJid);
        if (!contato) {
            var arquivo = (0, jsonConverte_1.readJSON)(pathBlackList);
            arquivo.push(remoteJid);
            (0, jsonConverte_1.writeJSON)(pathBlackList, arquivo);
            await reply('Bot desativado para o seu contato!');
        }
        else {
            var arquivo = (0, jsonConverte_1.readJSON)(pathBlackList);
            var index = arquivo.indexOf(remoteJid);
            arquivo.splice(index, 1);
            (0, jsonConverte_1.writeJSON)(pathBlackList, arquivo);
            await reply('Bot ativado para o seu contato!');
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
