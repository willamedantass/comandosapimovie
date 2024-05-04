"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyNumbers = exports.validate = exports.isAdmin = exports.isSuperAdmin = exports.downloadSticker = exports.downloadVideo = exports.downloadImage = exports.getRandomName = exports.isCommand = exports.extractCommandAndArgs = exports.extractDataFromWebMessage = exports.getCommand = exports.getBotData = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const general_1 = require("./configuration/general");
const jsonConverte_1 = require("./util/jsonConverte");
const getBotData = (socket, webMessage) => {
    const remoteJid = webMessage.key.remoteJid || '';
    const presenceTime = async (delayComposing, delayPaused) => {
        await socket.presenceSubscribe(remoteJid);
        await (0, baileys_1.delay)(delayComposing);
        await socket.sendPresenceUpdate('composing', remoteJid);
        await (0, baileys_1.delay)(delayPaused);
        await socket.sendPresenceUpdate('paused', remoteJid);
    };
    const sendText = async (ass, text) => {
        let assinatura = ass ? `${general_1.general.prefixEmoji} *${general_1.general.botName}* \n\n` : '';
        return await socket.sendMessage(remoteJid, {
            text: `${assinatura}${text}`,
        });
    };
    const sendButton = async (mensagem, textBtn1, textBtn2, textBtn3) => {
        const buttons = [
            { buttonId: 'id1', buttonText: { displayText: textBtn1 }, type: 1 },
            { buttonId: 'id2', buttonText: { displayText: textBtn2 }, type: 1 }
        ];
        if (textBtn3 !== undefined) {
            buttons.push({ buttonId: 'id3', buttonText: { displayText: textBtn3 }, type: 1 });
        }
        const buttonMessage = {
            text: `${general_1.general.prefixEmoji} *${general_1.general.botName}:* \n${mensagem}`,
            buttons: buttons,
            headerType: 1
        };
        return await socket.sendMessage(remoteJid, buttonMessage);
    };
    const reply = async (text) => {
        return await socket.sendMessage(webMessage.key.remoteJid, { text: `${general_1.general.prefixEmoji} *${general_1.general.botName}*\n\n${text}` }, { quoted: webMessage });
    };
    const sendImage = async (url, message = "", isReply = false) => {
        let options = {};
        if (isReply) {
            options = {
                quoted: webMessage,
            };
        }
        const buttonMessage = {
            image: { url: url },
            caption: message,
            headerType: 4
        };
        return await socket.sendMessage(remoteJid, buttonMessage);
    };
    const sendSticker = async (pathOrBuffer, isReply = true) => {
        let options = {};
        if (isReply) {
            options = {
                quoted: webMessage,
            };
        }
        const sticker = pathOrBuffer instanceof Buffer
            ? pathOrBuffer
            : fs_1.default.readFileSync(pathOrBuffer);
        return await socket.sendMessage(remoteJid, { sticker }, options);
    };
    const sendAudio = async (pathOrBuffer, isReply = true, ptt = true) => {
        let options = {};
        if (isReply) {
            options = {
                quoted: webMessage,
            };
        }
        const audio = pathOrBuffer instanceof Buffer
            ? pathOrBuffer
            : fs_1.default.readFileSync(pathOrBuffer);
        if (pathOrBuffer instanceof Buffer) {
            return await socket.sendMessage(remoteJid, {
                audio,
                ptt,
                mimetype: "audio/mpeg",
            }, options);
        }
        options = { ...options, url: pathOrBuffer };
        return await socket.sendMessage(remoteJid, {
            audio: { url: pathOrBuffer },
            ptt,
            mimetype: "audio/mpeg",
        }, options);
    };
    const sendApk = async () => {
        const pathAPK = path_1.default.join(__dirname, "..", "cache", "app.apk");
        const buffer = fs_1.default.readFileSync(pathAPK);
        return await socket.sendMessage(remoteJid, {
            document: buffer,
            mimetype: "application/vnd.android.package-archive",
            fileName: "LuccasNet.apk"
        });
    };
    const { messageText, isImage, isVideo, isSticker, isAudio, isDocument, userJid, replyJid, owner } = (0, exports.extractDataFromWebMessage)(webMessage);
    const { command, args } = (0, exports.extractCommandAndArgs)(messageText);
    return {
        presenceTime,
        sendButton,
        sendText,
        sendImage,
        sendSticker,
        sendAudio,
        sendApk,
        reply,
        remoteJid,
        userJid,
        replyJid,
        socket,
        webMessage,
        command,
        args,
        isImage,
        isVideo,
        isSticker,
        isAudio,
        isDocument,
        messageText,
        owner
    };
};
exports.getBotData = getBotData;
const getCommand = (commandName) => {
    const pathCache = path_1.default.join(__dirname, "..", "cache", "commands.json");
    const pathCommands = path_1.default.join(__dirname, "commands");
    const cacheCommands = (0, jsonConverte_1.readJSON)(pathCache);
    if (!commandName)
        return;
    const cacheCommand = cacheCommands.find((name) => name === commandName);
    if (!cacheCommand) {
        const command = fs_1.default
            .readdirSync(pathCommands)
            .find((file) => file.includes(commandName));
        if (!command) {
            throw new Error(`❌ Comando _${commandName}_ não encontrado! Digite ${general_1.general.prefix}menu para ver todos os comandos disponíveis!`);
        }
        (0, jsonConverte_1.writeJSON)(pathCache, [...cacheCommands, command.split('.')[0]]);
        return require(`./commands/${command}`).default;
    }
    return require(`./commands/${cacheCommand}`).default;
};
exports.getCommand = getCommand;
const extractDataFromWebMessage = (message) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    let remoteJid = '';
    let messageText = '';
    let owner = ((_a = message.key) === null || _a === void 0 ? void 0 : _a.fromMe) || false;
    let isReply = false;
    let replyJid = '';
    let replyText = '';
    const { key: { remoteJid: jid, participant: tempUserJid }, } = message;
    if (jid) {
        remoteJid = jid;
    }
    if (message) {
        const extendedTextMessage = (_b = message.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage;
        const buttonTextMessage = (_c = message.message) === null || _c === void 0 ? void 0 : _c.buttonsResponseMessage;
        const listTextMessage = (_d = message.message) === null || _d === void 0 ? void 0 : _d.listResponseMessage;
        const type1 = (_e = message.message) === null || _e === void 0 ? void 0 : _e.conversation;
        const type2 = extendedTextMessage === null || extendedTextMessage === void 0 ? void 0 : extendedTextMessage.text;
        const type3 = (_g = (_f = message.message) === null || _f === void 0 ? void 0 : _f.imageMessage) === null || _g === void 0 ? void 0 : _g.caption;
        const type4 = buttonTextMessage === null || buttonTextMessage === void 0 ? void 0 : buttonTextMessage.selectedButtonId;
        const type5 = (_h = listTextMessage === null || listTextMessage === void 0 ? void 0 : listTextMessage.singleSelectReply) === null || _h === void 0 ? void 0 : _h.selectedRowId;
        const type6 = (_k = (_j = message === null || message === void 0 ? void 0 : message.message) === null || _j === void 0 ? void 0 : _j.videoMessage) === null || _k === void 0 ? void 0 : _k.caption;
        messageText = type1 || type2 || type3 || type4 || type5 || type6 || "";
        isReply =
            !!extendedTextMessage && !!((_l = extendedTextMessage.contextInfo) === null || _l === void 0 ? void 0 : _l.quotedMessage);
        replyJid =
            extendedTextMessage && ((_m = extendedTextMessage.contextInfo) === null || _m === void 0 ? void 0 : _m.participant)
                ? extendedTextMessage.contextInfo.participant
                : '';
        replyText = ((_p = (_o = extendedTextMessage === null || extendedTextMessage === void 0 ? void 0 : extendedTextMessage.contextInfo) === null || _o === void 0 ? void 0 : _o.quotedMessage) === null || _p === void 0 ? void 0 : _p.conversation) || '';
    }
    const userJid = tempUserJid === null || tempUserJid === void 0 ? void 0 : tempUserJid.replace(/:[0-9][0-9]|:[0-9]/g, "");
    const tempMessage = message === null || message === void 0 ? void 0 : message.message;
    const isImage = !!(tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.imageMessage) ||
        !!((_s = (_r = (_q = tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.extendedTextMessage) === null || _q === void 0 ? void 0 : _q.contextInfo) === null || _r === void 0 ? void 0 : _r.quotedMessage) === null || _s === void 0 ? void 0 : _s.imageMessage);
    const isVideo = !!(tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.videoMessage) ||
        !!((_v = (_u = (_t = tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.extendedTextMessage) === null || _t === void 0 ? void 0 : _t.contextInfo) === null || _u === void 0 ? void 0 : _u.quotedMessage) === null || _v === void 0 ? void 0 : _v.videoMessage);
    const isAudio = !!(tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.audioMessage) ||
        !!((_y = (_x = (_w = tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.extendedTextMessage) === null || _w === void 0 ? void 0 : _w.contextInfo) === null || _x === void 0 ? void 0 : _x.quotedMessage) === null || _y === void 0 ? void 0 : _y.audioMessage);
    const isSticker = !!(tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.stickerMessage) ||
        !!((_1 = (_0 = (_z = tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.extendedTextMessage) === null || _z === void 0 ? void 0 : _z.contextInfo) === null || _0 === void 0 ? void 0 : _0.quotedMessage) === null || _1 === void 0 ? void 0 : _1.stickerMessage);
    const isDocument = !!(tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.documentMessage) ||
        !!((_4 = (_3 = (_2 = tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.extendedTextMessage) === null || _2 === void 0 ? void 0 : _2.contextInfo) === null || _3 === void 0 ? void 0 : _3.quotedMessage) === null || _4 === void 0 ? void 0 : _4.documentMessage);
    let mentionedJid = "";
    let mentionedJidObject = (_6 = (_5 = tempMessage === null || tempMessage === void 0 ? void 0 : tempMessage.extendedTextMessage) === null || _5 === void 0 ? void 0 : _5.contextInfo) === null || _6 === void 0 ? void 0 : _6.mentionedJid;
    if (mentionedJidObject) {
        mentionedJid = mentionedJidObject[0];
    }
    return {
        userJid,
        remoteJid,
        messageText,
        isReply,
        replyJid,
        replyText,
        isAudio,
        isImage,
        isSticker,
        isVideo,
        isDocument,
        mentionedJid,
        owner,
        webMessage: message,
    };
};
exports.extractDataFromWebMessage = extractDataFromWebMessage;
const extractCommandAndArgs = (message) => {
    if (!message)
        return { command: "", args: "" };
    const [command, ...tempArgs] = message.trim().split(" ");
    const args = tempArgs.reduce((acc, arg) => acc + " " + arg, "").trim();
    return { command, args };
};
exports.extractCommandAndArgs = extractCommandAndArgs;
const isCommand = (message) => message.length > 2 && message.startsWith(general_1.general.prefix);
exports.isCommand = isCommand;
const getRandomName = (extension) => {
    const fileName = Math.floor(Math.random() * 10000);
    if (!extension)
        return fileName.toString();
    return `${fileName}.${extension}`;
};
exports.getRandomName = getRandomName;
const downloadImage = async (webMessage, fileName, folder = null, ...subFolders) => {
    var _a, _b, _c, _d, _e;
    const content = (((_a = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _a === void 0 ? void 0 : _a.imageMessage) ||
        ((_e = (_d = (_c = (_b = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage) === null || _e === void 0 ? void 0 : _e.imageMessage));
    if (!content)
        return null;
    const stream = await (0, baileys_1.downloadContentFromMessage)(content, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let directory = [__dirname, "..", "assets"];
    if (!folder) {
        directory = [...directory, "temp"];
    }
    if (folder) {
        directory = [...directory, folder];
    }
    if (subFolders.length) {
        directory = [...directory, ...subFolders];
    }
    const filePath = path_1.default.resolve(...directory, `${fileName}.jpg`);
    await (0, promises_1.writeFile)(filePath, buffer);
    return filePath;
};
exports.downloadImage = downloadImage;
const downloadVideo = async (webMessage, fileName, folder = null, ...subFolders) => {
    var _a, _b, _c, _d, _e;
    const content = (((_a = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _a === void 0 ? void 0 : _a.videoMessage) ||
        ((_e = (_d = (_c = (_b = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage) === null || _e === void 0 ? void 0 : _e.videoMessage));
    if (!content)
        return null;
    const stream = await (0, baileys_1.downloadContentFromMessage)(content, "video");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let directory = [__dirname, "..", "assets"];
    if (!folder) {
        directory = [...directory, "temp"];
    }
    if (folder) {
        directory = [...directory, folder];
    }
    if (subFolders.length) {
        directory = [...directory, ...subFolders];
    }
    const filePath = path_1.default.resolve(...directory, `${fileName}.mp4`);
    await (0, promises_1.writeFile)(filePath, buffer);
    return filePath;
};
exports.downloadVideo = downloadVideo;
const downloadSticker = async (webMessage, fileName, folder = null, ...subFolders) => {
    var _a, _b, _c, _d, _e;
    const content = (((_a = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _a === void 0 ? void 0 : _a.stickerMessage) ||
        ((_e = (_d = (_c = (_b = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.contextInfo) === null || _d === void 0 ? void 0 : _d.quotedMessage) === null || _e === void 0 ? void 0 : _e.stickerMessage));
    if (!content)
        return null;
    const stream = await (0, baileys_1.downloadContentFromMessage)(content, "sticker");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let directory = [__dirname, "..", "assets"];
    if (!folder) {
        directory = [...directory, "temp"];
    }
    if (folder) {
        directory = [...directory, folder];
    }
    if (subFolders.length) {
        directory = [...directory, ...subFolders];
    }
    const filePath = path_1.default.resolve(...directory, `${fileName}.webp`);
    await (0, promises_1.writeFile)(filePath, buffer);
    return filePath;
};
exports.downloadSticker = downloadSticker;
const isSuperAdmin = async (botData) => {
    return await (0, exports.validate)("superadmin", botData);
};
exports.isSuperAdmin = isSuperAdmin;
const isAdmin = async (botData) => {
    return ((await (0, exports.validate)("admin", botData)) ||
        (await (0, exports.validate)("superadmin", botData)));
};
exports.isAdmin = isAdmin;
const validate = async (type, { remoteJid, socket, userJid }) => {
    if (!(0, baileys_1.isJidGroup)(remoteJid))
        return true;
    const { participants } = await socket.groupMetadata(remoteJid);
    const participant = participants.find((participant) => participant.id === userJid);
    return participant && participant.admin === type;
};
exports.validate = validate;
const onlyNumbers = (text) => {
    return text.replace(/[^0-9]/g, "");
};
exports.onlyNumbers = onlyNumbers;
