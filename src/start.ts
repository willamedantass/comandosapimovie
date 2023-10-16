import express from 'express';
import morgan from 'morgan';
import { StartSock, sendZap } from './bot';
import { pullDb } from './data/pullDB';
require('dotenv').config();

const server = async () => {
    await pullDb();
    const port = 3021;
    const app = express();
    const bodyParser = require('body-parser');
    app.use(morgan('dev'));
    app.use(bodyParser.json())
    app.post('/mensagem', sendZap);
    app.listen(port, function () {
        console.log("Node app is running at localhost:" + port)
    });
}
server();
StartSock();
