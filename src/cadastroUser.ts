import { ClearEmotionAndEspace } from "./util/stringClean";
import { gerarMensagemIa } from "./util/getMensagem";
import { userUpdate } from "./data/user.service";
import { IUser } from "./type/user.model";
import NodeCache from 'node-cache';

type UserState = {
    remoteJid: string,
    question: 'name' | 'newName' | 'info',
    nome: string
}

const userStateCache = new NodeCache({ stdTTL: 15 * 60 }); // TTL de 15 minutos

export const CadastroUser = async (user: IUser, data: any) => {
    const resposta = data.messageText;
    const userState = userStateCache.get<UserState>(user.remoteJid);

    if (userState) {
        switch (userState.question) {
            case 'name':
                await handleNameQuestion(user, data, resposta, userState);
                break;
            case 'newName':
                await handleNewNameQuestion(user, data, resposta, userState);
                break;
            default:
                break;
        }
    } else {
        await startUserRegistration(user, data);
    }
}

const handleNameQuestion = async (user: IUser, data: any, resposta: string, userState: UserState) => {
    if (resposta === 'sim') {
        if (userState.nome.length > 7 && userState.nome.split(" ").length > 1) {
            userState.question = 'info';
            user.isCadastrando = false;
            user.nome = userState.nome;
            await userUpdate(user);
            userStateCache.set(user.remoteJid, userState);
            await data.presenceTime(1000, 2000);
            await data.sendText(true, `Concluído, *${userState.nome}* seu cadastro foi criado!`);
        } else {
            userState.question = 'newName';
            userStateCache.set(user.remoteJid, userState);
            await data.presenceTime(1000, 1000);
            await data.sendText(true, '❌ Seu nome está curto, tente novamente!\n\nDigite seu nome e sobrenome:');
        }
    } else if (resposta === 'nao') {
        userState.question = 'newName';
        userStateCache.set(user.remoteJid, userState);
        await data.presenceTime(1000, 1000);
        await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
    } else {
        await data.presenceTime(1000, 1000);
        await data.sendText(true, `Posso lhe chamar por *${user.nome}*?\nDigite sim ou não.`);
    }

    if (userState.question === 'info') {
        userStateCache.del(user.remoteJid);
        await data.presenceTime(3000, 5000);
        await data.sendText(false, `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅Temos um servidor com muito potencial.\n✅Temos aplicativos para SmartTv, Android e IOS.\n✅Temos assistente virtual que irá realizar as tarefas de geração de login, pagamento e renovação.\n✅Não fazemos devolução de pagamento, faça seu teste primeiro.`);
    }
}

const handleNewNameQuestion = async (user: IUser, data: any, resposta: string, userState: UserState) => {
    userState.nome = ClearEmotionAndEspace(resposta);
    const res = await gerarMensagemIa("verificar_nome", { nome: userState.nome });
    try {
        const resultadoObjeto = JSON.parse(res);
        console.log(resultadoObjeto);

        if (resultadoObjeto.result && resultadoObjeto.genero) {
            userState.question = 'name';
            userState.nome = userState.nome;
            userStateCache.set(user.remoteJid, userState);
            await data.presenceTime(1000, 1000);
            await data.sendText(true, `Posso lhe chamar por *${userState.nome}*?\nDigite sim ou não.`);
        } else {
            await data.presenceTime(1000, 1000);
            await data.sendText(true, `❌ Seu nome não é valido, tente novamente!\n\nDigite seu nome e sobrenome:`);
        }
    } catch (error) {
        console.error(error.message);
    }
}

const startUserRegistration = async (user: IUser, data: any) => {
    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + 15);
    const newUserState: UserState = { remoteJid: user.remoteJid, question: 'newName', nome: user.nome };
    userStateCache.set(user.remoteJid, newUserState);
    await data.presenceTime(1000, 1000);
    await data.sendText(true, 'Vejo que é novo por aqui, vamos fazer seu cadastro para personalizar seu atendimento.');
    await data.presenceTime(1000, 1000);
    await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
}
