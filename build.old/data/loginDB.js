"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrial = exports.removeLogin = exports.updateLogin = exports.updateLoginLocal = exports.searchLoginsPorUId = exports.searchLoginPorUsername = exports.saveAllLogins = exports.allLogins = exports.criarLogin = void 0;
const loginsFirestore_1 = require("./loginsFirestore");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const pathJson = path_1.default.join(__dirname, "..", "..", "cache", "login.json");
const criarLogin = async (login) => {
    try {
        var arquivo = (0, jsonConverte_1.readJSON)(pathJson);
        const loginNew = await (0, loginsFirestore_1.FirestoreLoginCreate)(login);
        arquivo.push(loginNew);
        (0, jsonConverte_1.writeJSON)(pathJson, arquivo);
    }
    catch (error) {
        console.error(`Erro ao criar login. ${error}`);
    }
};
exports.criarLogin = criarLogin;
const allLogins = () => {
    return (0, jsonConverte_1.readJSON)(pathJson);
};
exports.allLogins = allLogins;
const saveAllLogins = (logins) => {
    (0, jsonConverte_1.writeJSON)(pathJson, logins);
};
exports.saveAllLogins = saveAllLogins;
const searchLoginPorUsername = (username) => {
    return (0, exports.allLogins)().find((value) => value.user === username);
};
exports.searchLoginPorUsername = searchLoginPorUsername;
const searchLoginsPorUId = (uid) => {
    return (0, exports.allLogins)().filter((value) => {
        return value.uid === uid;
    });
};
exports.searchLoginsPorUId = searchLoginsPorUId;
const updateLoginLocal = (login) => {
    try {
        const loginsNew = (0, exports.allLogins)().map(log => {
            if (log.user === login.user) {
                return login;
            }
            return log;
        });
        (0, exports.saveAllLogins)(loginsNew);
    }
    catch (error) {
        console.error(`Erro ao atualizar login. ${error}`);
    }
};
exports.updateLoginLocal = updateLoginLocal;
const updateLogin = async (login) => {
    try {
        const loginsNew = (0, exports.allLogins)().map(log => {
            if (log.user === login.user) {
                return login;
            }
            return log;
        });
        // await FirestoreLoginUpdate(login);
        (0, exports.saveAllLogins)(loginsNew);
    }
    catch (error) {
        console.error(`Erro ao atualizar login. ${error}`);
    }
};
exports.updateLogin = updateLogin;
const removeLogin = async (username) => {
    try {
        const login = (0, exports.searchLoginPorUsername)(username);
        if (login === undefined) {
            return 'Login não encontrado';
        }
        ;
        const loginsNew = (0, exports.allLogins)().filter(obj => obj.id !== login.id);
        await (0, loginsFirestore_1.FirestoreLoginDelete)(login);
        (0, exports.saveAllLogins)(loginsNew);
        return 'Login excluído com sucesso.';
    }
    catch (error) {
        console.error(`Erro ao excluir login. ${error}`);
        return 'Erro ao excluir login';
    }
};
exports.removeLogin = removeLogin;
const removeTrial = async () => {
    try {
        const loginsTrial = (0, exports.allLogins)().filter(login => login.isTrial);
        for (const login of loginsTrial) {
            const data = new Date(login.vencimento);
            const isRemove = Math.floor((new Date().getTime() - data.getTime()) / (1000 * 60 * 60 * 24)) > 5;
            if (isRemove) {
                await (0, exports.removeLogin)(login.user);
            }
        }
    }
    catch (error) {
        console.error(`Erro para remover logins trial. ${error}`);
    }
};
exports.removeTrial = removeTrial;
