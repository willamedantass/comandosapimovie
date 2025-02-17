import { readJSON } from "./util/jsonConverte";
import { ClearEmotionAndEspace } from "./util/stringClean";
import { getCommand, isCommand } from "./function";
import { CadastroUser } from './cadastroUser';
import { UserState } from "./type/UserState";
import { createUserState, getUserState, updateUserState } from "./menubot/UserState";
import { MenuEntretenimentoOpcoes } from "./menubot/MenuEntretenimentoOpcoes";
import { MenuLevel, menuTexts, OpcoesMenuMain } from "./menubot/MenuBot";
import { MenuMainOpcoes } from "./menubot/MenuMainOpcoes";
import { general } from "./configuration/general";
import { userAddNew, userFindByRemoteJid } from './data/user.service';
import { UserModel } from './type/user.model';
import { mensagem } from './util/getMensagem';
import path from "path";
import { ConvertWhatsAppEvent, convertWhatsAppEvent, WhatsAppEvent } from "./type/WhatsAppEvent";
import { readMessages, sendText } from "./util/evolution";

const pathBlacklist = path.join(__dirname, "..", "cache", "blacklist.json");

import { Request, Response } from "express";

export const handleMessages = async (req: Request, res: Response) => {
    try {
        const messageEvent: WhatsAppEvent = req.body;

        if (!messageEvent || typeof messageEvent !== "object") {
            console.error("Evento inválido recebido.");
            return res.status(400).json({ error: "Evento inválido" });
        }

        const mData = convertWhatsAppEvent(messageEvent);
        if (!mData) {
            console.error("Erro ao converter messageEvent.");
            return res.status(500).json({ error: "Erro ao processar mensagem" });
        }

        await readMessages([{ remoteJid: mData.remoteJid, fromMe: mData.owner, id: mData.id }]);

        if (messageEvent.event !== 'messages.upsert' || mData.messageType === 'reactionMessage') {
            return res.sendStatus(200);
        }

        const blacklist = readJSON(pathBlacklist);
        if (!Array.isArray(blacklist)) {
            console.error("Blacklist inválida.");
            return res.status(500).json({ error: "Erro interno" });
        }

        if (mData.remoteJid === "status@broadcast" || (blacklist.includes(mData.remoteJid) && !mData.owner) || mData.remoteJid.includes("@g.us")) {
            return res.sendStatus(200);
        }

        let user = await userFindByRemoteJid(mData.remoteJid).catch(err => { console.error("Erro ao buscar usuário:", err); return null; });

        if (!user && !mData.owner) {
            user = await registerNewUser(mData.pushName, mData.remoteJid).catch(err => {
                console.error("Erro ao registrar novo usuário:", err);
                return null;
            });
        }

        if (!mData.owner && user?.isCadastrando) {
            await CadastroUser(user, mData).catch(err => console.error("Erro no cadastro:", err));
            return res.sendStatus(200);
        }

        let userState: UserState | undefined = getUserState(mData.remoteJid);

        if (!mData.owner && user) {
            if (!userState) {
                userState = await createState(mData.remoteJid, user).catch(err => {
                    console.error("Erro ao criar estado:", err);
                    return undefined;
                });
                if (!userState) return res.sendStatus(500);
            } else {
                userState.messageId = mData.id;
                userState.conversation = mData.conversation;
            }

            if (mData.conversation && await handleMenuCommands(mData.conversation.toLowerCase(), userState, user)) {
                return res.sendStatus(200);
            }

            if (mData.conversation) {
                await handleUserState(mData.conversation, userState).catch(err => console.error("Erro ao processar estado do usuário:", err));
            }
        }

        const command = mData.conversation;
        if (!command || !isCommand(command) || userState?.status === true) {
            return res.sendStatus(200);
        }

        await executeCommand(command, mData).catch(err => console.error("Erro ao executar comando:", err));

        return res.sendStatus(200);
    } catch (error) {
        console.error("Erro inesperado:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

//old
// export const handleMessages = async (req, res) => {
//     try {
//         const messageEvent: WhatsAppEvent = req.body;
//         console.log("--------------------\n", messageEvent, "--------------------\n",);

//         const mData = convertWhatsAppEvent(messageEvent);
//         readMessages([{ remoteJid: mData.remoteJid, fromMe: mData.owner, id: mData.id }]);

//         if (messageEvent.event === 'messages.upsert' && messageEvent.data.messageType !== 'reactionMessage') {

//             const blacklist = readJSON(pathBlacklist);
//             if (mData.remoteJid === "status@broadcast") return res.end();
//             if (blacklist.includes(mData.remoteJid) && !mData.owner) return;
//             if (mData.remoteJid.includes("@g.us")) return;

//             let user = await userFindByRemoteJid(mData.remoteJid);
//             if (user === null && !mData.owner) {
//                 user = await registerNewUser(mData.pushName, mData.remoteJid);
//             }

//             if (!mData.owner && user && user.isCadastrando) {
//                 await CadastroUser(user, mData);
//                 return;
//             }

//             let userState: UserState | undefined = getUserState(mData.remoteJid);
//             if (!mData.owner && user) {
//                 if (!userState) {
//                     userState = await createState(mData.remoteJid, user);
//                     return
//                 } else {
//                     userState.messageId = mData.id;
//                     userState.conversation = mData.conversation;
//                 }

//                 if (await handleMenuCommands(mData.conversation?.toLowerCase(), userState, user)) return;

//                 await handleUserState(mData.conversation, userState);
//             }

//             const command = mData.conversation;
//             if (!isCommand(command) || userState?.status === true) return;
//             await executeCommand(command, mData);

//         }
//     } catch (error) {
//         console.error("Erro inesperado:", error);
//         return res.status(500).json({ error: "Erro interno do servidor" });
//     }
// };

const registerNewUser = async (pushName: string, remoteJid: string) => {
    const agora = new Date().toISOString();
    const nome = ClearEmotionAndEspace(pushName || '');
    const user = new UserModel({
        nome: nome,
        remoteJid: remoteJid,
        data_cadastro: agora,
        isCadastrando: true,
        acesso: 'usuario',
        pgtos_id: [],
        limite_pix: 0,
        data_pix: agora,
        credito: 0
    });
    await userAddNew(user);
    await sendText(remoteJid, `Olá, seja bem vindo à *MOVNOW*.\n\nMeu nome é *${general.botName}* sou um assistente virtual.`, false);
    return user;
}

const createState = async (remoteJid: string, user: any) => {
    const userState = createUserState(remoteJid, user, MenuLevel.MAIN);
    const msg = await mensagem('info_menu', user.nome);
    await sendText(remoteJid, msg, true);
    return userState;
};

const handleMenuCommands = async (conversation: string, userState: UserState, user: any): Promise<boolean> => {
    const menu: boolean = conversation === 'menu';
    if (menu) {
        userState.status = true;
        userState.user = user;
        updateUserState(userState);
        await sendText(user.remoteJid, menuTexts[MenuLevel.MAIN], true);
        return true;
    }

    const isCancel: boolean = ['sair', 'cancelar', 'desativar'].includes(conversation);
    if (userState.status && isCancel) {
        userState.status = false;
        updateUserState(userState);
        await sendText(user.remoteJid, 'MovBot desativado, para retornar é só enviar a palavra *MENU*.', true);
        return true;
    }

    return false;
};

const handleUserState = async (conversation: string, userState: UserState) => {
    if (userState.status) {
        const select = parseInt(conversation);
        // const isInvalidOption = isNaN(select) && !['voltar', 'sim', 'nao'].includes(conversation);
        // if (isInvalidOption) {
        //     const msg = await mensagem('opcao_invalida');
        //     await data.reply(msg);
        //     return;
        // }

        switch (userState.menuLevel) {
            case MenuLevel.MAIN:
                await handleMainOptions(userState, select, conversation);
                break;
            case MenuLevel.MENU_ENTRETENIMENTO:
                await handleEntertainmentOptions(userState, select);
                break;
        }
    }
};

const handleMainOptions = async (userState: UserState, select: number, conversation: string) => {
    const opcaoMenu = userState.opcaoMenu ? OpcoesMenuMain[userState.opcaoMenu].enum : OpcoesMenuMain[select - 1]?.enum;
    await MenuMainOpcoes(userState, opcaoMenu, conversation);
};

const handleEntertainmentOptions = async (userState: UserState, select: number) => {
    const opcaoMenu = userState.opcaoMenu ? OpcoesMenuMain[userState.opcaoMenu].enum : OpcoesMenuMain[select - 1]?.enum;
    await MenuEntretenimentoOpcoes(userState, opcaoMenu);
};

const executeCommand = async (command: string, mdata: ConvertWhatsAppEvent) => {
    try {
        const action = await getCommand(command.replace(general.prefix, ""));
        await action({ ...mdata });
    } catch (error) {
        console.error('Log_bot: ' + error);
    }
};
