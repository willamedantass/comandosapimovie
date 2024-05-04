import { PathLike } from 'fs';
export declare const readJSON: (pathFileJson: PathLike) => any;
export declare const readObject: (pathFileJson: PathLike) => any;
export declare const mensagem: (key: string, nome?: string) => string;
export declare const writeJSON: (pathFileJson: string, data: object) => void;
