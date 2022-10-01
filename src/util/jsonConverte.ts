import fs, { PathOrFileDescriptor } from 'fs'

export const readJSON = (pathFileJson: PathOrFileDescriptor) => {
    // @ts-ignore
    if(fs.existsSync(pathFileJson)){
        return JSON.parse(fs.readFileSync(pathFileJson, 'utf-8'));
    }
    return [];
};

export const writeJSON = (pathFileJson: string, data: object) => {
    fs.writeFileSync(pathFileJson, JSON.stringify(data));
};