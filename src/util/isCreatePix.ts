export const isCriarPix = (dataPix: string | undefined) => {
    if (dataPix) {
      try {
        var data = new Date(dataPix)
        let resposta = Math.floor((new Date().getTime() - data.getTime()) / (1000 * 60 * 60 * 24)) > 0;
        return resposta;
      } catch (error) {
        console.error('Erro ao tentar converter data no metodos function isCriarTeste')
      }
    } else {
      return true
    }
  }