import { LoginController } from "../controller/loginController";
import { PixController } from "../controller/PixController";
import { getMensagemLogin, getMensagemPix } from "../util/getMensagem";
import { StringClean } from "../util/stringClean";
import { LoginTituloType } from "../type/login";
import { mensagem } from "../util/jsonConverte";
import { updateUser } from "../data/userDB";
import { User } from "../type/user"

export const ConversationMenuMain = async (user: User, msg_conversation: string, data: any) => {
    if (msg_conversation === '1') {
        const isTrial = true;
        const isReneew = false;
        const username = StringClean(user.nome);
        const res = LoginController(username, isTrial, isReneew, user);
        if (!res.result) {
            return await data.reply(res.msg)
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.teste);
        await data.sendText(true, msg);
    } else if (msg_conversation === '2') {
        const isTrial = false;
        const isReneew = true;
        const username = StringClean(user.nome);
        const res = LoginController(username, isTrial, isReneew, user);
        if (!res.result) {
            return await data.reply(res.msg)
        }
        const msg: string = getMensagemLogin(res.data.user, res.data.password, res.data.vencimento, LoginTituloType.login);
        await data.sendText(true, msg);
    } else if (msg_conversation === '3') {
        const pix_data = await PixController(user);
        if (pix_data.result) {
            const msg = getMensagemPix(pix_data?.data.id, pix_data?.data.transaction_amount);
            await data.sendText(false,msg);
            await data.sendText(false, pix_data?.data.point_of_interaction.transaction_data.qr_code);
            await data.sendText(false, mensagem('pix'));
            user.data_pix = new Date().toISOString();
            await updateUser(user);
            // removeUserState(user.remoteJid);
        } else {
            await data.sendText(true, pix_data.msg);
        }
    }  else if (msg_conversation === '4') {
        await data.reply('Essa opção está em desenvolvimento.')
    } else {
        data.reply('Opção incorreta. Digite a palavra *sair* para desativar o MovBot.')
    }
}