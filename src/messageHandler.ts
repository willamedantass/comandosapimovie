import { readJSON } from "./util/jsonConverte";
import { ClearEmotionAndEspace, StringClean } from "./util/stringClean";
import { getBotData, getCommand, isCommand } from "./function";
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

const pathBlacklist = path.join(__dirname, "..", "cache", "blacklist.json");

export const handleMessagesUpsert = async (upsert: any, socket: any) => {
    if (upsert.type === 'notify') {
        for (const msg of upsert.messages) {
            const remoteJid = msg.key?.remoteJid;
            const owner: boolean = msg.key?.fromMe || false;

            const blacklist = readJSON(pathBlacklist);
            if (remoteJid === "status@broadcast") return;
            if (blacklist.includes(remoteJid) && !owner) return;
            if (remoteJid.includes("@g.us")) return;

            const { command, ...data } = getBotData(socket, msg);
            let user = await userFindByRemoteJid(msg.key.remoteJid);
            if (user === null && !owner) {
                user = await registerNewUser(data);
            }

            if (!owner && user && user.isCadastrando) {
                await CadastroUser(user, data);
                return;
            }

            let userState: UserState | undefined = getUserState(data.remoteJid);
            if (!owner && user) {
                if (!userState) {
                    userState = await createState(data, user);
                    return
                }

                const conversation = data.messageText.toLowerCase();
                if (await handleMenuCommands(conversation, data, userState, user)) return;

                await handleUserState(conversation, data, userState);
            }

            if (!isCommand(command) || userState?.status === true) return;
            await executeCommand(command, data);
        }
    }
};

const registerNewUser = async (data: any) => {
    const agora = new Date().toISOString();
    const nome = ClearEmotionAndEspace(data.webMessage.pushName || '');
    const user = new UserModel({
        nome: nome,
        remoteJid: data.remoteJid,
        data_cadastro: agora,
        isCadastrando: true,
        acesso: 'usuario',
        pgtos_id: [],
        limite_pix: 0,
        data_pix: agora,
        credito: 0
    });
    await userAddNew(user);
    await data.presenceTime(1000, 1000);
    await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n\nMeu nome é *${general.botName}* sou um assistente virtual.`);
    return user;
}

const createState = async (data: any, user: any) => {
    const userState = createUserState(data.remoteJid, user, MenuLevel.MAIN);
    const msg = await mensagem('info_menu', user.nome);
    await data.sendText(true, msg);
    return userState;
};

const handleMenuCommands = async (conversation: string, data: any, userState: UserState, user: any): Promise<boolean> => {
    const menu: boolean = conversation === 'menu';
    if (menu) {
        userState.status = true;
        userState.user = user;
        updateUserState(userState);
        await data.sendText(true, menuTexts[MenuLevel.MAIN]);
        return true;
    }

    const isCancel: boolean = ['sair', 'cancelar', 'desativar'].includes(conversation);
    if (userState.status && isCancel) {
        userState.status = false;
        updateUserState(userState);
        await data.sendText(true, 'MovBot desativado, para retornar é só enviar a palavra *MENU*.');
        return true;
    }

    return false;
};

const handleUserState = async (conversation: string, data: any, userState: UserState) => {
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
                await handleMainOptions(userState, select, conversation, data);
                break;
            case MenuLevel.MENU_ENTRETENIMENTO:
                await handleEntertainmentOptions(userState, select, conversation, data);
                break;
        }
    }
};

const handleMainOptions = async (userState: UserState, select: number, conversation: string, data: any) => {
    const opcaoMenu = userState.opcaoMenu ? OpcoesMenuMain[userState.opcaoMenu].enum : OpcoesMenuMain[select - 1]?.enum;
    await MenuMainOpcoes(userState, opcaoMenu, conversation, data);
};

const handleEntertainmentOptions = async (userState: UserState, select: number, conversation: string, data: any) => {
    const opcaoMenu = userState.opcaoMenu ? OpcoesMenuMain[userState.opcaoMenu].enum : OpcoesMenuMain[select - 1]?.enum;
    await MenuEntretenimentoOpcoes(userState, opcaoMenu, conversation, data);
};

const executeCommand = async (command: string, data: any) => {
    try {
        const action = await getCommand(command.replace(general.prefix, ""));
        await action({ command, ...data });
    } catch (error) {
        console.error('Log_bot: ' + error);
    }
};
