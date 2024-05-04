import { Login } from "../type/login";
export declare const FirestoreLoginAll: () => Promise<Login[]>;
export declare const FirestoreLoginCreate: (login: Login) => Promise<Login>;
export declare const FirestoreLoginUpdate: (login: Login) => Promise<void>;
export declare const FirestoreLoginDelete: (login: Login) => Promise<void>;
