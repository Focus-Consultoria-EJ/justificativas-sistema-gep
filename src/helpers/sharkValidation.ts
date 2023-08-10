import { passwordEncrypt } from "../middlewares/password.middleware";
import { EmailPessoal } from "../models/EmailPessoal";
import { Shark } from "../models/Shark";
import { phoneValidation } from "./phoneValidation";
import { CPFValidation, emailValidation, isNumber, phoneFormat } from "./validation";

export interface SharkForm
{
    shark: Shark;
    emailPessoal: EmailPessoal;
}

/**
 * Verifica se a senha está no formato esperado.
 * @param senha - a senha a ser validada.
 * @returns a senha caso esteja, se não retorna false.
 */
export const sharkPasswordCheck = (senha: string) => 
{
    if(String(senha).length < 8 || String(senha).length >= 30)
        return false;
    return senha;
};

/**
 * Verifica os dados vindo do header de shark.
 * @param shark - um objeto contendo as informações do shark.
 * @param actionUpdate - um boolean especificando se o formulário é do tipo insert ou update. Por padrão,
 * é false indicando que é uma inseração.
 * @returns o objeto shark.
 */
export const sharkFormValidation = async (shark: any, actionUpdate = false): Promise<SharkForm | string> => 
{
    // Só verifica o campo se a ação for do tipo update e a senha tiver setada.
    if(actionUpdate)
    {
        if(shark.senha && !sharkPasswordCheck(shark.senha))
            return "Digite uma senha com 8 ou mais caracteres. (max: 30)";
    }
    else
    {
        if(!shark.senha || !sharkPasswordCheck(shark.senha))
            return "Digite uma senha com 8 ou mais caracteres. (max: 30)";
    }

    if(!shark.nome || String(shark.nome).length < 4 || String(shark.nome).length >= 120)
        return "Digite um nome com 4 ou mais caracteres. (max: 120)";

    if(!shark.emailFocus || !emailValidation(shark.emailFocus))
        return "Digite um email Focus válido.";

    if(!shark.emailPessoal || !emailValidation(shark.emailPessoal))
        return "Digite um email pessoal válido.";

    if(shark.emailPessoal === shark.email)
        return "Os emails não podem ser idênticos";

    if(!shark.cpf || !CPFValidation(shark.cpf))
        return "Digite um cpf válido.";

    if(!shark.matricula || !isNumber(shark.matricula) || 
        String(shark.matricula).length < 9 || String(shark.matricula).length > 14)
        return "Digite uma matrícula válida.";

    if(!shark.distancia || !isNumber(shark.distancia) || parseInt(shark.distancia) < 0)
        return "Digite uma distância válida.";

    if(!shark.celula || !isNumber(shark.celula) || parseInt(shark.celula) < 0)
        return "Digite uma célula válida.";

    // Campos Opcionais abaixo:

    if(shark.telefone && !phoneValidation(shark.telefone))
        return "Digite um telefone válido.";

    shark.membroAtivo = (shark.membroAtivo === "") ? undefined : shark.membroAtivo;
    if(shark.membroAtivo && (shark.membroAtivo !== "true" && shark.membroAtivo !== "false" && 
        shark.membroAtivo !== "0" && shark.membroAtivo !== "1") )
        return "Digite um membro ativo válido.";

    shark.numProjeto = (shark.numProjeto === "") ? undefined : shark.numProjeto;
    if(shark.numProjeto && (!isNumber(shark.numProjeto) || parseInt(shark.celula) < 0) )
        return "Digite um número de projeto válido.";

    shark.metragem = (shark.metragem === "") ? undefined : shark.metragem;
    if(shark.metragem && ( !isNumber(shark.metragem) || parseInt(shark.celula) < 0) )
        return "Digite uma metragem maior que 0.";

    shark.role = (shark.role === "") ? undefined : shark.role;
    if(shark.role === "" || (shark.role && (!isNumber(shark.role) || parseInt(shark.role) < 0)) )
        return "Digite um valor válido para o role.";

    // Criptografa a Senha
    shark.senha = shark.senha !== undefined ? await passwordEncrypt(shark.senha) : "";
    
    if(shark.membroAtivo)
        shark.membroAtivo = (shark.membroAtivo == "true" || shark.membroAtivo == 1) ? true : false;

    return {
        shark: {
            id: shark.id, 
            nome: shark.nome, 
            email: shark.emailFocus, 
            cpf: shark.cpf, 
            matricula: shark.matricula, 
            distancia: { id: shark.distancia }, 
            celula: { id: shark.celula },
            telefone: phoneFormat(shark.telefone)!,
            senha: shark.senha,
            numProjeto: shark.numProjeto ?? 0,
            metragem: shark.metragem ?? 24,
            role: { id: shark.role ?? 1 }, // Se não passado, será membro
            membroAtivo: shark.membroAtivo ?? true,
            dataCriacao: shark.DataCriacao ?? new Date()
        },
        emailPessoal: {
            shark: shark,
            email: shark.emailPessoal
        }
    };
}; 