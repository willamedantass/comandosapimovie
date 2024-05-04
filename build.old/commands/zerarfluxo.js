"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fluxoAcessoDB_1 = require("../data/fluxoAcessoDB");
const livePassDB_1 = require("../data/livePassDB");
exports.default = async ({ sendText, owner }) => {
    if (owner) {
        (0, fluxoAcessoDB_1.zerarUserFluxo)();
        (0, livePassDB_1.zerarLivePass)();
        await sendText(true, 'Fluxo zerado com sucesso.');
    }
};
