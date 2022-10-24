const teste = () => {
    let dataOld = new Date();
    let minutos = 0;
    while (true) {
        const dataNow = new Date();
        if (dataOld.getMinutes() === dataNow.getMinutes() && minutos > 4) {

            //console.log('nao atualiza minuto');   
        }else {
            minutos = minutos > 4 ? 0 : minutos + 1
            dataOld= new Date();
            console.log(`${minutos} minutos`);
        }
    }
}

teste()