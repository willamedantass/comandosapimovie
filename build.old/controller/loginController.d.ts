import { User } from "../type/user";
import { Result } from "../util/result";
export declare const LoginController: (username: string, isTrial: boolean, isReneew: boolean, user: User) => Promise<Result>;
