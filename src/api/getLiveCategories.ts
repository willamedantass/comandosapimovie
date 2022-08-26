import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveCategories = async () => {

    const res = await getAxiosResult('get_live_categories', Provedor.tigotv);    
    if (res?.status == 200) {
        return res.data;
    }
}
