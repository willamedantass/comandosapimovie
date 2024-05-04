"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastroUser = void 0;
const stringClean_1 = require("./util/stringClean");
const userDB_1 = require("./data/userDB");
const updateUserState = (userState) => {
    usersState = usersState.map((user) => {
        if (user.remoteJid === userState.remoteJid) {
            return userState;
        }
        return user;
    });
};
const updateExpire = () => {
    const currentDate = new Date();
    usersState = usersState.filter(userState => currentDate < userState.expire);
};
const removeUserState = (userState) => {
    usersState = usersState.filter(user => user.remoteJid !== userState.remoteJid);
};
let usersState = [];
const CadastroUser = async (user, data) => {
    updateExpire();
    const resposta = (0, stringClean_1.StringClean)(data.messageText);
    const userState = usersState.find(value => value.remoteJid === user.remoteJid);
    if (userState) {
        switch (userState.question) {
            case 'name':
                if (resposta === 'sim') {
                    if (user.nome.length > 7 && user.nome.split(" ").length > 1) {
                        userState.question = 'info';
                        user.isCadastrando = false;
                        await (0, userDB_1.createUser)(user);
                        updateUserState(userState);
                        await data.presenceTime(1000, 2000);
                        await data.sendText(true, `Concluído, *${user.nome}* seu cadastro foi criado!`);
                    }
                    else {
                        userState.question = 'newName';
                        updateUserState(userState);
                        await data.presenceTime(1000, 1000);
                        await data.sendText(true, '❌ Seu nome está curto, tente novamente!\n\nDigite seu nome e sobrenome:');
                    }
                }
                else if (resposta === 'nao') {
                    userState.question = 'newName';
                    updateUserState(userState);
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
                }
                else {
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, `Posso lhe chamar por *${user.nome}*?\nDigite sim ou não.`);
                }
                break;
            case 'newName':
                user.nome = (0, stringClean_1.ClearEmotionAndEspace)(data.messageText);
                userState.question = 'name';
                await (0, userDB_1.updateUser)(user);
                updateUserState(userState);
                await data.presenceTime(1000, 1000);
                await data.sendText(true, `Posso lhe chamar por *${user.nome}*?\nDigite sim ou não.`);
                break;
            default:
                break;
        }
        if (userState.question === 'info') {
            removeUserState(userState);
            await data.presenceTime(3000, 5000);
            await data.sendText(false, `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅Temos um servidor com muito potêncial.\n✅Temos aplicativos para SmartTv, Android e IOS.\n✅Temos assistente virtual que irá realizar as tarefas de geração de login, pagamento e renovação.\n✅Não fazemos devolução de pagamento, faça seu teste primeiro.`);
        }
    }
    else {
        const expire = new Date();
        expire.setMinutes(expire.getMinutes() + 15);
        usersState.push({ remoteJid: user.remoteJid, question: 'newName', expire: expire });
        await data.sendText(true, 'Vejo que é novo por aqui, vamos fazer seu cadastro para personalizar seu atendimento.');
        await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
    }
};
exports.CadastroUser = CadastroUser;
