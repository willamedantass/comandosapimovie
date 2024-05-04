import { LivePass } from "../type/livePass";
export declare const addLivePass: (login: LivePass) => void;
export declare const readLivePass: () => LivePass[];
export declare const unusedUserLivePass: (isRandom: boolean) => LivePass | undefined;
export declare const searchLivePass: (username: string) => LivePass | undefined;
export declare const zerarLivePass: () => void;
export declare const updateLivePass: (updatedLogin: LivePass) => void;
export declare const deleteLivePass: (username: string) => void;
export declare const processTrial: () => void;
