import { UserState } from "../type/UserState";
import { MenuLevel } from "./MenuBot";
import { User } from "../type/user";
export declare const getUserState: (remoteJid: string) => UserState | undefined;
export declare const CreateUserState: (remoteJid: string, user: User, menuLevel: MenuLevel, opcaoMenu?: string) => UserState;
export declare const UpdateUserState: (userState: UserState) => void;
export declare const removeUserState: (remoteJid: string) => void;
