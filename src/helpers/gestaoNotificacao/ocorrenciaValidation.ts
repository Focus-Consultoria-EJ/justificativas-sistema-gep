import { Ocorrencia } from "../../models/gestaoNotificacao/Ocorrencia";
import { isNumber, isValidDate } from "../validation";

/**
 * Verifica os dados vindo do header de ocorrência.
 * @param ocorrencia - um objeto contendo as informações de ocorrência.
 * @returns o objeto ocorrência.
 */
export const ocorrenciaFormValidation = async (ocorrencia: any): Promise<Ocorrencia | string> => 
{
               
    if(!ocorrencia.tipoAssunto || !isNumber(ocorrencia.tipoAssunto) || parseInt(ocorrencia.tipoAssunto) < 0)
        return "Digite um tipo de assunto válido.";   

    if(!ocorrencia.tipoOcorrencia || !isNumber(ocorrencia.tipoOcorrencia) || parseInt(ocorrencia.tipoOcorrencia) < 0)
        return "Digite um tipo de ocorrência válido.";

    if(!ocorrencia.mensagem || String(ocorrencia.mensagem).length <= 4 || String(ocorrencia.mensagem).length >= 300)
        return "A mensagem precisa ser maior que 4 caracteres. (max: 300)"; 

    // Campos Opcionais abaixo:    

    if(ocorrencia.sharkReferente && (!isNumber(ocorrencia.sharkReferente) || parseInt(ocorrencia.sharkReferente) < 0))
        return "Digite um shark referente válido.";

    ocorrencia.valorMetragem = (ocorrencia.valorMetragem === "") ? undefined : ocorrencia.valorMetragem;
    if(ocorrencia.valorMetragem && (!isNumber(ocorrencia.valorMetragem) || parseInt(ocorrencia.valorMetragem) < 0))
        return "Digite um valor de metragem que seja maior que 0."; 

    ocorrencia.nivelAdvertencia = (ocorrencia.nivelAdvertencia === "") ? undefined : ocorrencia.nivelAdvertencia;
    if(ocorrencia.nivelAdvertencia && (!isNumber(ocorrencia.nivelAdvertencia) || parseInt(ocorrencia.nivelAdvertencia) < 0))
        return "Digite um nível de advertência válido"; 

    ocorrencia.nivelGratificacao = (ocorrencia.nivelGratificacao === "") ? undefined : ocorrencia.nivelGratificacao;
    if(ocorrencia.nivelGratificacao && (!isNumber(ocorrencia.nivelGratificacao) || parseInt(ocorrencia.nivelGratificacao) < 0))
        return "Digite um nível de gratificação válido"; 

    ocorrencia.dataOcorrido = (ocorrencia.dataOcorrido === "") ? undefined : ocorrencia.dataOcorrido;
    if(ocorrencia.dataOcorrido && !isValidDate(ocorrencia.dataOcorrido))
        return "A data do ocorrido está inválida.";

    return {
        id: ocorrencia.id,
        dataOcorrido: ocorrencia.dataOcorrido ?? new Date(),
        tipoOcorrencia: { id: ocorrencia.tipoOcorrencia },
        tipoAssunto: { id: ocorrencia.tipoAssunto },
        mensagem: ocorrencia.mensagem,
        valorMetragem: 0,
        nivelAdvertencia: { id: ocorrencia.nivelAdvertencia },
        nivelGratificacao: { id: ocorrencia.nivelGratificacao },
        sharkReferente: { id: ocorrencia.sharkReferente, nome: ocorrencia.sharkReferenteNome, 
            email: ocorrencia.sharkReferenteEmail, celula: { id: ocorrencia.sharkReferenteCelula} },
        sharkCriador: { id: undefined, nome: "", 
            email: "", celula: { id: undefined } }
    };
}; 
