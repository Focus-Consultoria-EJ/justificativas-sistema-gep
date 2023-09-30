import { Cliente } from "../../models/precificacao/Cliente";
import { isNumber } from "../validation";

/**
 * Verifica os dados vindo do header de cliente.
 * @param cliente - dados do body contendo as informações do cliente.
 * @returns um objeto do tipo Cliente.
 */
export const clienteFormValidation = async (cliente: any): Promise<Cliente | string> => 
{
    if(!cliente.nome || String(cliente.nome).length <= 3 || String(cliente.nome).length > 200)
        return "O nome do cliente precisa ser maior que 3 caracteres. (max: 200)"; 

    if(!cliente.nomeEmpresa || String(cliente.nomeEmpresa).length <= 3 || String(cliente.nomeEmpresa).length > 400)
        return "A nome da empresa precisa ser maior que 3 caracteres. (max: 400)"; 

    if(!cliente.tipoCliente || String(cliente.tipoCliente).length <= 3 || String(cliente.tipoCliente).length > 200)
        return "O tipo do cliente precisa ser maior que 3 caracteres. (max: 200)";

    if(!cliente.negociador || String(cliente.negociador).length <= 3 || String(cliente.negociador).length > 200)
        return "O negociador precisa ser maior que 3 caracteres. (max: 200)";

    if(!cliente.estado || String(cliente.estado).length <= 3 || String(cliente.estado).length > 100)
        return "O estado precisa ser maior que 3 caracteres. (max: 100)";

    if(!cliente.cidade || String(cliente.cidade).length <= 3 || String(cliente.cidade).length > 100)
        return "A cidade precisa ser maior que 3 caracteres. (max: 100)";

    if(!cliente.porteCliente && (!isNumber(cliente.porteCliente) || parseInt(cliente.porteCliente) < 0))
        return "Digite um porte de cliente válido.";

    // Opcionais

    if(cliente.idade && (!isNumber(cliente.idade) || parseInt(cliente.idade) < 0))
        return "Digite uma idade válida.";

    if(cliente.sexo && (String(cliente.sexo).length <= 3 || String(cliente.sexo).length > 50))
        return "O sexo precisa ser maior que 3 caracteres. (max: 50)";

    return { ...cliente, porteCliente: { id: cliente.porteCliente } };
}; 
