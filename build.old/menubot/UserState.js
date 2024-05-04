"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserState = exports.UpdateUserState = exports.CreateUserState = exports.getUserState = void 0;
const userStates = [];
const updateExpire = () => {
    const currentDate = new Date();
    userStates.forEach((user, index) => {
        if (currentDate > user.expire) {
            userStates.splice(index, 1);
        }
    });
};
const getUserState = (remoteJid) => {
    updateExpire();
    return userStates.find(state => state.remoteJid === remoteJid);
};
exports.getUserState = getUserState;
const CreateUserState = (remoteJid, user, menuLevel, opcaoMenu) => {
    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + 15);
    const status = false;
    const userState = { remoteJid, user, menuLevel, expire, opcaoMenu, status };
    userStates.push(userState);
    return userState;
};
exports.CreateUserState = CreateUserState;
const UpdateUserState = (userState) => {
    const existingState = (0, exports.getUserState)(userState.remoteJid);
    if (existingState) {
        existingState.menuLevel = userState.menuLevel;
        existingState.opcaoMenu = userState.opcaoMenu;
        existingState.renovacaoState = userState.renovacaoState;
    }
};
exports.UpdateUserState = UpdateUserState;
const removeUserState = (remoteJid) => {
    userStates.forEach((user, index) => {
        if (remoteJid === user.remoteJid) {
            userStates.splice(index, 1);
        }
    });
};
exports.removeUserState = removeUserState;
