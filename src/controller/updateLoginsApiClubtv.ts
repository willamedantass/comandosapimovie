import { zerarUserFluxo } from "../data/fluxoAcessoDB";
import { writeJSON } from "../util/jsonConverte";
import path from "path";
require('dotenv/config');


export const updateLoginsApiClubtv = async (): Promise<void> => {
    const axios = require('axios');
    const res = await axios.post(`${process.env.SERVER_API}/alllogins`, null, {
        headers: { 'authorization': process.env.SECRET_ACESS as string }
    }).catch(e => console.log(e));

    if (res?.status === 200 && res?.data?.result && res?.data?.data?.length > 0) {
        const pathJson = path.join(__dirname, "..", "..", "cache", "live_pass.json");
        console.log(res.data.msg);
        writeJSON(pathJson, res.data.data);
        zerarUserFluxo();
    }

}