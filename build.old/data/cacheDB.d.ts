import { Cache } from "../type/cache";
export declare const readOption: (action: string) => Cache;
export declare const readCache: (action: string) => any;
export declare const readAction: (action: string) => any;
export declare const createCache: (action: string, data: any) => void;
export declare const createAndUpdateCache: (cache: Cache) => void;
