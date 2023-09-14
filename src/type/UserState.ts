import { MenuLevel } from "../menubot/Menu";
import { RenovacaoState } from "./RenovacaoState";
import { User } from "./user";

export interface UserState {
    remoteJid: string;
    user: User;
    menuLevel: MenuLevel;
    expire: Date;
    status: boolean;
    process?: boolean | undefined;
    opcaoMenu?: string | undefined;
    renovacaoState?: RenovacaoState | undefined;
}