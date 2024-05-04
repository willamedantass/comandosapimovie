import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { LivePass } from "../type/livePass";
export declare const createUserFluxo: (user: string, livePass: LivePass) => void;
export declare const readUserFluxo: () => userFluxoAcesso[];
export declare const searchUserFluxo: (user: string) => userFluxoAcesso | undefined;
export declare const zerarUserFluxo: () => void;
export declare const updateUserFluxo: (userFluxo: userFluxoAcesso) => Promise<void>;
export declare const processUserFluxo: () => void;
