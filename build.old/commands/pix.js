"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PixController_1 = require("../controller/PixController");
const userDB_1 = require("../data/userDB");
const getMensagem_1 = require("../util/getMensagem");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ remoteJid, reply, sendText }) => {
    const user = (0, userDB_1.searchUser)(remoteJid);
    if (user) {
        const pix_data = await (0, PixController_1.PixController)(user);
        if (pix_data.result) {
            await reply((0, getMensagem_1.getMensagemPix)(pix_data === null || pix_data === void 0 ? void 0 : pix_data.data.id, pix_data === null || pix_data === void 0 ? void 0 : pix_data.data.transaction_amount));
            await sendText(false, pix_data === null || pix_data === void 0 ? void 0 : pix_data.data.point_of_interaction.transaction_data.qr_code);
            await sendText(false, (0, jsonConverte_1.mensagem)('pix'));
            user.data_pix = new Date().toISOString();
            user.limite_pix = (user === null || user === void 0 ? void 0 : user.limite_pix) ? user.limite_pix + 1 : 1;
            (0, userDB_1.updateUser)(user);
        }
        else {
            await sendText(true, pix_data.msg);
        }
    }
};
