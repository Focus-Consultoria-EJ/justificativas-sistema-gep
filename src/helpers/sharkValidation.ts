import { passwordEncrypt } from "../middlewares/password.middleware";
import { Shark } from "../models/Shark";
import { phoneValidation } from "./phoneValidation";
import { CPFValidation, emailValidation, isNumber, phoneFormat } from "./validation";

/**
 * Verifica os dados vindo do header de shark.
 * @param shark - um objeto contendo as informações do shark.
 * @param actionUpdate - um boolean especificando se o formulário é do tipo insert ou update. Por padrão,
 * é false indicando que é uma inseração.
 * @returns o objeto shark.
 */
export const sharkFormValidation = async (shark: any, actionUpdate = false): Promise<Shark | string> => 
{
    // Só verifica o campo se a ação for do tipo update e a senha tiver setada.
    if(actionUpdate)
    {
        if(shark.senha && (String(shark.senha).length < 8 || String(shark.senha).length >= 30))
            return "Digite uma senha com 8 ou mais caracteres. (max: 30)";
    }
    else
    {
        if(!shark.senha || String(shark.senha).length < 8 || String(shark.senha).length >= 30)
            return "Digite uma senha com 8 ou mais caracteres. (max: 30)";
    }

    if(!shark.nome || String(shark.nome).length < 4 || String(shark.nome).length >= 120)
        return "Digite um nome com 4 ou mais caracteres. (max: 120)";

    if(!shark.email || !emailValidation(shark.email))
        return "Digite uma email válido.";

    if(!shark.cpf || !CPFValidation(shark.cpf))
        return "Digite um cpf válido.";

    if(!shark.matricula || !isNumber(shark.matricula) || 
        String(shark.matricula).length < 9 || String(shark.matricula).length > 14)
        return "Digite uma matrícula válida.";

    if(!shark.distancia || !isNumber(shark.distancia) || parseInt(shark.distancia) < 0)
        return "Digite uma distância válida.";

    if(!shark.celula || !isNumber(shark.celula) || parseInt(shark.celula) < 0)
        return "Digite uma célula válida.";

    if(shark.telefone && !phoneValidation(shark.telefone))
        return "Digite um telefone válido.";
    
    if(shark.membroAtivo && (!isNumber(shark.membroAtivo) || 
        (parseInt(shark.membroAtivo) < 0 || parseInt(shark.membroAtivo) > 1)) )
        return "Digite um membro ativo válido.";

    if(shark.numProjeto && (!isNumber(shark.numProjeto) || parseInt(shark.celula) < 0) )
        return "Digite um número de projeto válido.";

    if(shark.metragem && (!isNumber(shark.metragem) || parseInt(shark.celula) < 0) )
        return "Digite uma metragem maior que 0.";

    if(shark.admin && (!isNumber(shark.admin) || 
        (parseInt(shark.admin) < 0 || parseInt(shark.admin) > 1)) )
        return "Digite um valor válido para o administrador.";

    // Criptografa a Senha
    shark.senha = shark.senha !== undefined ? await passwordEncrypt(shark.senha) : "";

    return {
        id: shark.id, 
        nome: shark.nome, 
        email: shark.email, 
        cpf: shark.cpf, 
        matricula: shark.matricula, 
        distancia: { id: shark.distancia }, 
        celula: { id: shark.celula },
        telefone: phoneFormat(shark.telefone)!,
        senha: shark.senha,
        numProjeto: shark.numProjeto,
        metragem: shark.metragem ?? 24,
        admin: shark.admin ?? false,
        membroAtivo: shark.membroAtivo ?? true,
        dataCriacao: shark.DataCriacao ?? new Date()
    };
}; 