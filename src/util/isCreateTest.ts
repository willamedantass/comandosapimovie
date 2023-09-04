export const isCriarTeste = (dataTeste: string | undefined) => {
    if (dataTeste) {
        try {
            var data = new Date(dataTeste)
            //calcula diferenca entre duas datas e retorna em dias.            
            return Math.floor((new Date().getTime() - data.getTime()) / (1000 * 60 * 60 * 24)) > 3;
        } catch (error) {
            console.error('Erro ao tentar converter data.')
        }
    } else {
        return true
    }
}