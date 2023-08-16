import { Precificacao } from "../../models/precificacao/Precificacao";
import { isNumber } from "../validation";

/**
 * Verifica os dados vindo do header de precificação.
 * @param precificacao - dados do body contendo as informações da precificação.
 * @returns um objeto do tipo Cliente.
 */
export const precificacaoFormValidation = async (precificacao: any): Promise<Precificacao | string> => 
{
    if(!precificacao.servico && (!isNumber(precificacao.servico) || parseInt(precificacao.servico) < 0))
        return "Digite um serviço válido.";

    if(!precificacao.cliente && (!isNumber(precificacao.cliente) || parseInt(precificacao.cliente) < 0))
        return "Digite um cliente válido.";
    
    if(!precificacao.tipoNegocio || String(precificacao.tipoNegocio).length <= 3 || String(precificacao.tipoNegocio).length > 200)
        return "O tipo de negocio precisa ser maior que 3 caracteres. (max: 200)";
    
    if(!precificacao.margemIncerteza && (!isNumber(precificacao.margemIncerteza) || parseInt(precificacao.margemIncerteza) < 0))
        return "Digite uma margem de incerteza válida.";

    if(!precificacao.qtdMembros && (!isNumber(precificacao.qtdMembros) || parseInt(precificacao.qtdMembros) < 0))
        return "Digite uma quantidade de membros válido.";

    if(!precificacao.modalidade || String(precificacao.modalidade).length <= 3 || String(precificacao.modalidade).length > 200)
        return "A modalidade precisa ser maior que 3 caracteres. (max: 200)";

    if(!precificacao.tipoPreco && (!isNumber(precificacao.tipoPreco) || parseInt(precificacao.tipoPreco) < 0))
        return "Digite um tipo de preço válido.";

    if(!precificacao.entrada && (!isNumber(precificacao.entrada) || parseInt(precificacao.entrada) < 0))
        return "Digite uma entrada válida.";

    if(!precificacao.parcelado && (!isNumber(precificacao.parcelado) || parseInt(precificacao.parcelado) < 0))
        return "Digite uma parcela válida.";

    if(!precificacao.valorParcelas && (!isNumber(precificacao.valorParcelas) || parseInt(precificacao.valorParcelas) < 0))
        return "Digite um valor de parcela válido.";

    if(!precificacao.valorAVista && (!isNumber(precificacao.valorAVista) || parseInt(precificacao.valorAVista) < 0))
        return "Digite um valor à vista válido.";
    
    // Opcionais

    precificacao.composta = (precificacao.composta === "") ? undefined : precificacao.composta;
    if(precificacao.composta && (precificacao.composta !== "true" && precificacao.composta !== "false" && 
        precificacao.composta !== "0" && precificacao.composta !== "1") )
        return "Digite uma composta válida.";

    // Converte o campo para booleano
    if(precificacao.composta)
        precificacao.composta = (precificacao.composta === "true" || precificacao.composta === "1");

    if(precificacao.composta)
    {
        precificacao.servicoComposto = (precificacao.servicoComposto === "") ? undefined : precificacao.servicoComposto;
        if(precificacao.servicoComposto && (!isNumber(precificacao.servicoComposto) || parseInt(precificacao.servicoComposto) < 0))
            return "Digite um serviço composto válido."; 
    
        if(!precificacao.servicoComposto)
            return "Digite um serviço composto.";  
    }    

    return { 
        ...precificacao,  
        composta: precificacao.composta ?? false,
        servico: { id: precificacao.servico },
        servicoComposto: (precificacao.composta) ? { id: precificacao.servicoComposto } : undefined,
        cliente: { id: precificacao.cliente },
        tipoPreco: { id: precificacao.tipoPreco}
    };
}; 
