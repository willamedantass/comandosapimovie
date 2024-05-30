import { provedorAcesso } from "../type/provedor";
import { readJSON } from "../util/jsonConverte";
import dotenv from 'dotenv';
import path from "path";
dotenv.config();

export const xmltv = async (_, res) => {
    const idProvedor = process.env.PROVIDER_LIVE_ID;
    const acesso: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idProvedor);
    const link = `${acesso?.dns}/xmltv.php?username=${acesso?.user}&password=${acesso?.password}`;
    console.log('Carregado epg');
    res.set('location', link);
    res.status(301).send();
}