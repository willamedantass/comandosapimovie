import { provedorAcesso } from "../type/provedor";
import { readJSON } from "../util/jsonConverte";
import path from "path";

export const xmltv = async (req, res) => {
    const idProvedor = process.env.PROVEDOR_LIVES_ID;
    const acesso: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idProvedor);
    const link = `${acesso.dns}/xmltv.php?username=${acesso.user}&password=${acesso.password}`;
    console.log('Carregado epg');
    res.set('location', link);
    res.status(301).send()
}