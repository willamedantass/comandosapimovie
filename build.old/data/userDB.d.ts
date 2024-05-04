import { Login } from "../type/login";
import { User } from "../type/user";
export declare const createUser: (user: User) => Promise<string | undefined>;
export declare const preCreateUser: (user: User) => void;
export declare const searchUser: (remoteJid: string) => User | undefined;
export declare const searchUserLogins: (remoteJid: string) => Login[];
export declare const allUser: () => User[];
export declare const saveAllUser: (users: User[]) => void;
export declare const updateUser: (user: User) => Promise<void>;
