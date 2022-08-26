import router from './routes/index';
import express from 'express';
import morgan from 'morgan';

const server = async () => {
    const port = process.env.SERVER_PROXY_PORT || 3000;
    const app = express();
    app.use(morgan('dev'));
    app.use(router);
    app.listen(port, function () {
        console.log("Node app is running at localhost:" + port)
    });
}

server();
