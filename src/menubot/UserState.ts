import { MenuLevel } from "./Menu";

interface UserState {
    remoteJid: string;
    menuLevel: MenuLevel;
    expire: Date;
}

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

export const updateUserState = (remoteJid: string, menuLevel: MenuLevel, expire: Date): void => {
    const existingState = getUserState(remoteJid);
    if (existingState) {
        existingState.menuLevel = menuLevel;
    } else {
        userStates.push({ remoteJid, menuLevel, expire });
    }
}

export const removeUserState = (remoteJid: string): void => {
    userStates.forEach((user, index) => {
        if (remoteJid === user.remoteJid) {
            userStates.splice(index, 1);
        }
    });
}