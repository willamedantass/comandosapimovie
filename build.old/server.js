"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./routes/index"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const server = async () => {
    const port = process.env.SERVER_PROXY_PORT || 3000;
    const app = (0, express_1.default)();
    app.use((0, morgan_1.default)('dev'));
    app.use(index_1.default);
    app.listen(port, function () {
        console.log("Node app is running at localhost:" + port);
    });
};
server();
