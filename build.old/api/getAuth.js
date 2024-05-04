"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = void 0;
const auth_1 = require("../type/auth");
require('dotenv/config');
const getAuth = async (login) => {
    let options = {
        timeZone: 'America/Sao_Paulo',
        hour12: false
    };
    const today = new Date();
    let auth_pass = auth_1.auth;
    auth_pass['user_info'].username = login.user;
    auth_pass['user_info'].password = login.password;
    auth_pass['user_info'].is_trial = login.isTrial ? '1' : '0';
    auth_pass['user_info'].status = (today > new Date(login.vencimento)) ? ': Esta Vencida!' : 'Active';
    auth_pass['user_info'].created_at = String(new Date(login.dataCadastro).getTime()).substring(0, 10);
    auth_pass['user_info'].exp_date = String(new Date(login.vencimento).getTime()).substring(0, 10);
    auth_pass['server_info'].url = process.env.SERVER_PROXY_IP;
    auth_pass['server_info'].port = process.env.SERVER_PROXY_PORT;
    auth_pass['server_info'].timestamp_now = today.getTime();
    auth_pass['server_info'].time_now = today.toLocaleString('pt-br', options);
    return auth_pass;
};
exports.getAuth = getAuth;
