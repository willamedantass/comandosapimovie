import bot, { sendZap } from './bot';
import express from 'express';
import morgan from 'morgan';
require('dotenv').config();

const server = async () => {
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
bot();
