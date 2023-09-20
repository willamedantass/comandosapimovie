import { proto } from '@whiskeysockets/baileys'
import { User } from '../type/user';

export interface IBotData {
    presenceTime: any;
    sendButton: (mensagem: string, textBtn1: string, textBtn2: string, textBtn3?: string) => Promise<proto.WebMessageInfo>;
    sendText: (ass: boolean, text: string) => Promise<proto.WebMessageInfo>;
    sendImage: (url: string, message?: string, isReply?: boolean) => Promise<proto.WebMessageInfo>;
    sendSticker: (pathOrBuffer: string | Buffer, isReply?: boolean) => Promise<proto.WebMessageInfo>;
    sendAudio: (pathOrBuffer: string | Buffer, isReply?: boolean, ptt?: boolean) => Promise<proto.WebMessageInfo>;
    sendApk: () => Promise<proto.WebMessageInfo>;
    reply: (text: string) => Promise<proto.WebMessageInfo>;
    socket: any;
    remoteJid: string;
    replyJid: string;
    webMessage: proto.IWebMessageInfo;
    isImage: boolean;
    isSticker: boolean;
    isAudio: boolean;
    isVideo: boolean;
    isDocument: boolean;
    command: string;
    args: string;
    userJid: string | undefined;
    messageText: string;
    user: User;
    owner: boolean;
}