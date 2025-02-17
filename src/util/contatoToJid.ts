export const contatoClean = (contato: string): string | null => {
    // Remove o código do país se existir
    if (contato.startsWith('+55')) {
      contato = contato.replace('+55', '');
    }
  
    // Remove espaços, traços e parênteses
    contato = contato.replace(/[\s()-]/g, '');
  
    // Verifica se o contato contém apenas dígitos após a limpeza
    if (!/^\d+$/.test(contato)) {
      return null; // Retorna null se o contato não for válido
    }
  
    // Verifica se o comprimento do número está entre 10 e 11 dígitos
    if (contato.length < 10 || contato.length > 11) {
      return null; // Retorna null se o comprimento não for válido
    }
  
    return contato;
  }