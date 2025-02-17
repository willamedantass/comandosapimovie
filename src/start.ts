import { StartSock, sendZap } from './bot';
import { connectDB } from './data/mongodb';
import express from 'express';
import morgan from 'morgan';
import { handleMessages } from './handleMessages';
require('dotenv').config();

const server = async () => {
    await connectDB();
    const port = 3021;
    const app = express();
    const bodyParser = require('body-parser');
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use('/', handleMessages)
    app.listen(port, function () {
        console.log("Node app is running at localhost:" + port)
    });
}
server();
