import { User } from "../type/user";
export declare const FirestoreUserAll: () => Promise<User[]>;
export declare const FirestoreUserCreate: (user: User) => Promise<User>;
export declare const FirestoreUserUpdate: (user: User) => Promise<void>;
