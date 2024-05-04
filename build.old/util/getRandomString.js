"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomString = void 0;
const getRandomString = () => {
    let characters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    let charactersLength = characters.length;
    let randomuser = "";
    for (let i = 0; i < 7; i++) {
        randomuser += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomuser;
};
exports.getRandomString = getRandomString;
