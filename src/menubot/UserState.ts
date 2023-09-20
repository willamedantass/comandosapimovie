import { UserState } from "../type/UserState";
import { MenuLevel } from "./MenuBot";
import { User } from "../type/user";

const userStates: UserState[] = [];

const updateExpire = () => {
    const currentDate = new Date();
    userStates.forEach((user, index) => {
        if (currentDate > user.expire) {
            userStates.splice(index, 1);
        }
    });
}

export const getUserState = (remoteJid: string): UserState | undefined => {
    updateExpire();
    return userStates.find(state => state.remoteJid === remoteJid);
}

export const CreateUserState = (remoteJid: string, user: User, menuLevel: MenuLevel, opcaoMenu?: string): UserState => {
    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + 15);
    const status = false;
    const userState: UserState = { remoteJid, user, menuLevel, expire, opcaoMenu, status }
    userStates.push(userState);
    return userState;
}

export const UpdateUserState = (userState: UserState): void => {
    const existingState = getUserState(userState.remoteJid);
    if (existingState) {
        existingState.menuLevel = userState.menuLevel;
        existingState.opcaoMenu = userState.opcaoMenu;
        existingState.renovacaoState = userState.renovacaoState;
    }
}

export const removeUserState = (remoteJid: string): void => {
    userStates.forEach((user, index) => {
        if (remoteJid === user.remoteJid) {
            userStates.splice(index, 1);
        }
    });
}