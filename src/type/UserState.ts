import { RenovacaoState } from "./RenovacaoState";
import { MenuLevel } from "../menubot/MenuBot";
import { IUser } from "./user.model";

export interface UserState {
    remoteJid: string;
    user: IUser;
    menuLevel: MenuLevel;
    status: boolean;
    process?: boolean | undefined;
    opcaoMenu?: string | undefined;
    renovacaoState?: RenovacaoState | undefined;
}