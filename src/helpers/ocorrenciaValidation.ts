import { isNumber, isValidDate } from "./validation";

/**
 * Verifica os dados vindo do header de ocorrência.
 * @param ocorrencia - um objeto contendo as informações de ocorrência.
 * @returns o objeto ocorrência.
 */
export const ocorrenciaFormValidation = async (ocorrencia: any) => 
{
    
    if(!ocorrencia.tipo_ocorrencia || !isNumber(ocorrencia.tipo_ocorrencia) || parseInt(ocorrencia.tipo_ocorrencia) < 0)
        return "Digite um tipo de ocorrência válido."; 

    if(ocorrencia.shark_referente && (!isNumber(ocorrencia.shark_referente) || parseInt(ocorrencia.shark_referente) < 0))
        return "Digite um shark referente válido.";
           
    if(!ocorrencia.tipo_assunto || !isNumber(ocorrencia.tipo_assunto) || parseInt(ocorrencia.tipo_assunto) < 0)
        return "Digite um tipo de assunto válido.";   

    if(!ocorrencia.tipo_ocorrencia || !isNumber(ocorrencia.tipo_ocorrencia) || parseInt(ocorrencia.tipo_ocorrencia) < 0)
        return "Digite um tipo de ocorrência válido.";

    if(!ocorrencia.mensagem || String(ocorrencia.mensagem).length <= 4 || String(ocorrencia.mensagem).length >= 300)
        return "A mensagem precisa ser maior que 4 caracteres e menor que 300"; 

    if(ocorrencia.valor_metragem && (!isNumber(ocorrencia.valor_metragem) || parseInt(ocorrencia.valor_metragem) < 0))
        return "Digite um valor de metragem que seja maior que 0."; 

    if(ocorrencia.data_ocorrido && !isValidDate(ocorrencia.data_ocorrido))
        return "A data do ocorrido está inválida.";

    return ocorrencia;
}; 