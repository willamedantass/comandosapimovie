"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCriarPix = void 0;
const userDB_1 = require("../data/userDB");
const isCriarPix = (user) => {
    const agora = new Date();
    const dataPix = new Date(user.data_pix);
    if (dataPix.getDate() === agora.getDate()) {
        const limite = user.limite_pix;
        if (limite < 5) {
            user.limite_pix = limite + 1;
            (0, userDB_1.updateUser)(user);
            return true;
        }
        else {
            return false;
        }
    }
    else {
        user.limite_pix = user.limite_pix + 1;
        user.data_pix = agora.toISOString();
        (0, userDB_1.updateUser)(user);
        return true;
    }
};
exports.isCriarPix = isCriarPix;
