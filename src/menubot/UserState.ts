import { UserState } from "../type/UserState";
import { IUser } from "../type/user.model";
import { MenuLevel } from "./MenuBot";
import NodeCache from 'node-cache';

const userStateCache = new NodeCache({ stdTTL: 15 * 60 }); // TTL (Time To Live) de 15 minutos

export const getUserState = (remoteJid: string): UserState | undefined => {
    return userStateCache.get<UserState>(remoteJid);
}

export const createUserState = (remoteJid: string, user: IUser, menuLevel: MenuLevel): UserState => {
    const userState: UserState = { remoteJid, user, menuLevel, status: false, messageId: '', conversation: '' };
    userStateCache.set(remoteJid, userState);
    return userState;
}

export const updateUserState = (userState: UserState): void => {
    userStateCache.del(userState.remoteJid);
    userStateCache.set(userState.remoteJid, userState);
}

export const removeUserState = (remoteJid: string): void => {
    userStateCache.del(remoteJid);
}
