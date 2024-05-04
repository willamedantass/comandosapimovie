import { Login } from "../type/login";
export declare const criarLoginsExcluidos: (login: Login) => void;
export declare const readLoginsExcluidos: () => Login[];
export declare const searchLoginsExcluidosPorUsername: (username: string) => Login | undefined;
export declare const searchLoginsPorUId: (uid: string) => Login[];
export declare const updateLoginsExcluidos: (login: Login) => void;
