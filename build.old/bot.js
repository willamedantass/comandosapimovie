"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendZap = exports.StartSock = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const UserState_1 = require("./menubot/UserState");
const MenuEntretenimentoOpcoes_1 = require("./menubot/MenuEntretenimentoOpcoes");
const MenuBot_1 = require("./menubot/MenuBot");
const stringClean_1 = require("./util/stringClean");
const function_1 = require("./function");
const MenuMainOpcoes_1 = require("./menubot/MenuMainOpcoes");
const userDB_1 = require("./data/userDB");
const jsonConverte_1 = require("./util/jsonConverte");
const general_1 = require("./configuration/general");
const cadastroUser_1 = require("./cadastroUser");
const logger_1 = __importDefault(require("./util/logger"));
const node_cache_1 = __importDefault(require("node-cache"));
const node_process_1 = require("node:process");
const uid_1 = require("uid");
const path_1 = __importDefault(require("path"));
let socket;
const pathBlacklist = path_1.default.join(__dirname, "..", "cache", "blacklist.json");
const useStore = !process.argv.includes('--no-store');
const msgRetryCounterCache = new node_cache_1.default();
const logger = logger_1.default.child({});
logger.level = 'info';
const store = useStore ? (0, baileys_1.makeInMemoryStore)({ logger }) : undefined;
store === null || store === void 0 ? void 0 : store.readFromFile(path_1.default.join(__dirname, "..", "cache", "baileys_store_multi.json"));
setInterval(() => {
    store === null || store === void 0 ? void 0 : store.writeToFile(path_1.default.join(__dirname, "..", "cache", "baileys_store_multi.json"));
}, 10000);
const StartSock = async () => {
    const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(path_1.default.join(__dirname, "..", "cache", "baileys_auth_info"));
    const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
    socket = (0, baileys_1.default)({
        version,
        logger,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
        },
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        getMessage,
    });
    store === null || store === void 0 ? void 0 : store.bind(socket.ev);
    socket.ev.process(async (events) => {
        var _a, _b, _c, _d, _e, _f;
        if (events['connection.update']) {
            const update = events['connection.update'];
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                    (0, exports.StartSock)();
                }
                else {
                    console.error('servidor reiniciado!');
                    process.kill(node_process_1.pid);
                }
            }
            console.info('connection update', update);
        }
        // credentials updated -- save them
        if (events['creds.update']) {
            await saveCreds();
        }
        if (events['messages.upsert']) {
            const upsert = events['messages.upsert'];
            if (upsert.type === 'notify') {
                for (const msg of upsert.messages) {
                    const remoteJid = (_c = msg.key) === null || _c === void 0 ? void 0 : _c.remoteJid;
                    const owner = ((_d = msg.key) === null || _d === void 0 ? void 0 : _d.fromMe) || false;
                    const blacklist = (0, jsonConverte_1.readJSON)(pathBlacklist);
                    //ignorar mensagens de brodcast
                    if (remoteJid === "status@broadcast")
                        return;
                    //Blacklist
                    if (blacklist.includes(remoteJid) && !owner)
                        return;
                    const { command, ...data } = (0, function_1.getBotData)(socket, msg);
                    let user = (0, userDB_1.searchUser)(msg.key.remoteJid);
                    if (user === undefined && !owner) {
                        const agora = new Date().toISOString();
                        const nome = (0, stringClean_1.ClearEmotionAndEspace)(data.webMessage.pushName || '');
                        user = {
                            id: (0, uid_1.uid)(8),
                            nome: nome,
                            remoteJid: data.remoteJid,
                            data_cadastro: agora,
                            isCadastrando: true,
                            acesso: owner ? 'adm' : 'usuario',
                            pgtos_id: [],
                            limite_pix: 0,
                            data_pix: agora,
                            credito: 0
                        };
                        (0, userDB_1.preCreateUser)(user);
                        await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n\nMeu nome é *${general_1.general.botName}* sou um assistente virtual.`);
                    }
                    if (!owner && user && user.isCadastrando) {
                        await (0, cadastroUser_1.CadastroUser)(user, data);
                        return;
                    }
                    let userState = (0, UserState_1.getUserState)(data.remoteJid);
                    if (!owner && user) {
                        if (!userState) {
                            userState = (0, UserState_1.CreateUserState)(data.remoteJid, user, MenuBot_1.MenuLevel.MAIN);
                            await data.sendText(true, (0, jsonConverte_1.mensagem)('info_menu', user.nome));
                        }
                        const conversation = (0, stringClean_1.StringClean)(data.messageText);
                        const menu = conversation === 'menu' ? true : false;
                        if (menu) {
                            userState.status = true;
                            userState.user = user;
                            (0, UserState_1.UpdateUserState)(userState);
                            return await data.sendText(true, MenuBot_1.menuTexts[MenuBot_1.MenuLevel.MAIN]);
                        }
                        const isCancel = (conversation === 'sair' || conversation === 'cancelar' || conversation === 'desativar') ? true : false;
                        if (userState.status && isCancel) {
                            userState.status = false;
                            (0, UserState_1.UpdateUserState)(userState);
                            return await data.sendText(true, 'MovBot desativado, para retornar é só enviar a palavra *MENU*.');
                        }
                        if (userState.status) {
                            let opcaoMenu;
                            const select = parseInt(conversation);
                            if (isNaN(select) && !['voltar', 'sim', 'nao'].includes(conversation)) {
                                return await data.reply((0, jsonConverte_1.mensagem)('opcao_invalida'));
                            }
                            switch (userState.menuLevel) {
                                case MenuBot_1.MenuLevel.MAIN:
                                    opcaoMenu = (userState === null || userState === void 0 ? void 0 : userState.opcaoMenu) ? MenuBot_1.OpcoesMenuMain[userState.opcaoMenu].enum : (_e = MenuBot_1.OpcoesMenuMain[select - 1]) === null || _e === void 0 ? void 0 : _e.enum;
                                    (0, MenuMainOpcoes_1.MenuMainOpcoes)(userState, opcaoMenu, conversation, data);
                                    break;
                                case MenuBot_1.MenuLevel.MENU_ENTRETENIMENTO:
                                    opcaoMenu = (userState === null || userState === void 0 ? void 0 : userState.opcaoMenu) ? MenuBot_1.OpcoesMenuMain[userState.opcaoMenu].enum : (_f = MenuBot_1.OpcoesMenuMain[select - 1]) === null || _f === void 0 ? void 0 : _f.enum;
                                    (0, MenuEntretenimentoOpcoes_1.MenuEntretenimentoOpcoes)(userState, opcaoMenu, conversation, data);
                                    break;
                            }
                            return;
                        }
                    }
                    if (!(0, function_1.isCommand)(command) || (userState === null || userState === void 0 ? void 0 : userState.status) === true)
                        return;
                    try {
                        const action = await (0, function_1.getCommand)(command.replace(general_1.general.prefix, ""));
                        await action({ command, ...data });
                    }
                    catch (error) {
                        console.error('Log_bot: ' + error);
                    }
                }
            }
        }
    });
    return socket;
    async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id);
            return (msg === null || msg === void 0 ? void 0 : msg.message) || undefined;
        }
        return baileys_1.proto.Message.fromObject({});
    }
};
exports.StartSock = StartSock;
const sendZap = async (req, res) => {
    const body = req.body;
    let contato = (body === null || body === void 0 ? void 0 : body.contato) || null;
    const remoteJid = (body === null || body === void 0 ? void 0 : body.remoteJid) || null;
    const mensagem = (body === null || body === void 0 ? void 0 : body.mensagem) || '';
    if (!contato && !remoteJid) {
        console.error('Não foi possível enviar a mensagem, parâmetros não foi enviado.');
        return res.status(400).end();
    }
    try {
        contato = (contato === null || contato === void 0 ? void 0 : contato.startsWith('55')) ? contato.substring(2) : contato;
        const JID = remoteJid ? remoteJid : `55${contato}@s.whatsapp.net`;
        const assinatura = `${general_1.general.prefixEmoji} *${general_1.general.botName}:* \n`;
        await socket.sendMessage(JID, { text: `${assinatura}${mensagem}` });
        res.status(200).end();
    }
    catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(400).end();
    }
};
exports.sendZap = sendZap;
