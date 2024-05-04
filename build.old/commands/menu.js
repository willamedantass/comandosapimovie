"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
exports.default = async ({ reply, sendText, owner }) => {
    if (owner) {
        const commands = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, '..', '..', 'cache', 'commands.json'));
        let msg = 'Lista de comandos:\n';
        commands.forEach(command => {
            msg += `#${command}\n`;
        });
        await sendText(false, msg);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
