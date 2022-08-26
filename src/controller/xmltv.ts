export const xmltv = async (req, res) => {
    const link = `${process.env.SERVER_DNS_TIGO}/xmltv.php?username=${process.env.SERVER_TIGO_USER}&password=${process.env.SERVER_TIGO_PASSWORD}`;
    console.log('Carregado epg');
    res.set('location', link);
    res.status(301).send()
}