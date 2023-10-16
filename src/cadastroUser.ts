import { ClearEmotionAndEspace, StringClean } from "./util/stringClean";
import { mensagem } from "./util/jsonConverte";
import { updateUser } from "./data/userDB";
import { User } from "./type/user";

type UserState = {
    remoteJid: string,
    question: 'name' | 'newName' | 'info',
    expire: Date,
}


const updateUserState = (userState: UserState) => {
    usersState = usersState.map((user) => {
        if (user.remoteJid === userState.remoteJid) {
            return userState;
        }
        return user;
    });
}

const updateExpire = () => {
    const currentDate = new Date();
    usersState = usersState.filter(userState => currentDate < userState.expire);
}

const removeUserState = (userState: UserState) => {
    usersState = usersState.filter(user => user.remoteJid !== userState.remoteJid);
}

let usersState: UserState[] = [];
export const CadastroUser = async (user: User, data: any) => {
    updateExpire();
    const resposta = StringClean(data.messageText);
    const userState = usersState.find(value => value.remoteJid === user.remoteJid);

    if (userState) {
        switch (userState.question) {
            case 'name':
                if (resposta === 'sim') {
                    if (user.nome.length > 7) {
                        userState.question = 'info';
                        user.isCadastrando = false;
                        await updateUser(user);
                        updateUserState(userState);
                        await data.presenceTime(1000, 2000);
                        await data.sendText(true, `Concluído, *${user.nome}* seu cadastro foi criado!`);
                    } else {
                        userState.question = 'newName';
                        updateUserState(userState);
                        await data.presenceTime(1000, 1000);
                        await data.sendText(true, '❌ Seu nome está curto, tente novamente!\n\nDigite seu nome e sobrenome:')
                    }
                } else if (resposta === 'nao') {
                    userState.question = 'newName';
                    updateUserState(userState);
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
                } else {
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, `Posso lhe chamar por *${user.nome}*?\nDigite sim ou não.`);
                }
                break;
            case 'newName':
                user.nome = ClearEmotionAndEspace(data.messageText);
                userState.question = 'name';
                await updateUser(user);
                updateUserState(userState);
                await data.presenceTime(1000, 1000);
                await data.sendText(true, `Posso lhe chamar por *${user.nome}*?\nDigite sim ou não.`);
                break;
            default:
                break
        }

        if (userState.question === 'info') {
            removeUserState(userState);
            await data.presenceTime(3000, 5000);
            await data.sendText(false, `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅Temos um servidor com muito potêncial.\n✅Temos aplicativos para SmartTv, Android e IOS.\n✅Temos assistente virtual que irá realizar as tarefas de geração de login, pagamento e renovação.\n✅Não fazemos devolução de pagamento, faça seu teste primeiro.`);
        }
    } else {
        const expire = new Date();
        expire.setMinutes(expire.getMinutes() + 15);
        usersState.push({ remoteJid: user.remoteJid, question: 'newName', expire: expire });
        await data.sendText(true, 'Vejo que é novo por aqui, vamos fazer seu cadastro para personalizar seu atendimento.')
        await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
    }
}