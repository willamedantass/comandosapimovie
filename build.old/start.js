"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const pullDB_1 = require("./data/pullDB");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require('dotenv').config();
const server = async () => {
    await (0, pullDB_1.pullDb)();
    const port = 3021;
    const app = (0, express_1.default)();
    const bodyParser = require('body-parser');
    app.use((0, morgan_1.default)('dev'));
    app.use(bodyParser.json());
    app.post('/mensagem', bot_1.sendZap);
    app.listen(port, function () {
        console.log("Node app is running at localhost:" + port);
    });
};
server();
(0, bot_1.StartSock)();
