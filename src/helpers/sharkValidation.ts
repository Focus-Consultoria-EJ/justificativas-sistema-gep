import { phoneValidation } from "./phoneValidation";
import { emailValidation, isNumber } from "./validation";

// Verifica os dados vindo do header
export const sharkFormValidation = async (shark: any) => 
{
    if(!shark.nome || String(shark.nome).length < 4 || String(shark.nome).length > 120)
        return "Digite um nome com 4 ou mais caracteres. (max: 120)";
    
    if(!shark.email || !emailValidation(shark.email))
        return "Digite uma email válido.";

    if(!shark.senha || String(shark.senha).length < 8 || String(shark.senha).length > 30)
        return "Digite uma senha com 8 ou mais caracteres. (max: 30)";
    
    if(!shark.matricula || !isNumber(shark.matricula) || 
        String(shark.matricula).length < 9 || String(shark.matricula).length > 14)
        return "Digite uma matrícula válida.";

    if(!shark.distancia || !isNumber(shark.distancia) || parseInt(shark.distancia) < 0 )
        return "Digite uma distância válida.";

    if(!shark.celula || !isNumber(shark.celula) || parseInt(shark.celula) < 0 )
        return "Digite uma célula válida.";

    if(shark.telefone && !phoneValidation(shark.telefone))
        return "Digite um telefone ativo válido.";

    if(shark.membro_ativo && (!isNumber(shark.membro_ativo) || 
        (parseInt(shark.membro_ativo) < 0 || parseInt(shark.membro_ativo) > 1)) )
        return "Digite um membro ativo válido.";

    if(shark.num_projeto && (!isNumber(shark.num_projeto) || parseInt(shark.celula) < 0) )
        return "Digite um número de projeto válido.";

    if(shark.metragem && (!isNumber(shark.metragem) || parseInt(shark.celula) < 0) )
        return "Digite uma metragem maior que 0.";

    if(shark.admin && (!isNumber(shark.admin) || 
        (parseInt(shark.admin) < 0 || parseInt(shark.admin) > 1)) )
        return "Digite um valor válido para o administrador.";

    return shark;
}; 