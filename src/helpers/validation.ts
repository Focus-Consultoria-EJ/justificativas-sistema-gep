/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadRequestError, CustomError } from "../middlewares/Error.middleware";
import { errMsg } from "./ErrorMessages";

/**
 * Verifica se o valor existe, se o array possui dados e se o string está vazio.
 * @param value - uma variável, um texto ou array.
 * @param msg - a mensagem caso ocorra um erro.
 */
export const valueExists = (value: any, msg: string): void => 
{
    if(!value) throw new CustomError(msg, 400);
    if(Array.isArray(value) && value.length === 0) throw new CustomError(msg, 400);
    if(typeof value === "string" && !value.trim()) throw new CustomError(msg, 400);
};

/**
 * Verifica se o e-mail é válido.
 * @param email - o e-mail a ser testado.
 * @returns um boolean indicando se o e-mail é válido.
 */
export const emailValidation = (email:string) =>
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Verifica se o cpf é válido. O formato esperado é 123.456.789-10.
 * @param cpf - o cpf a ser testado.
 * @returns um boolean indicando se o cpf é válido.
 */
export const CPFValidation = (cpf: string) =>
{
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
};

/**
 * Verifica se um texto é um número.
 * @param num - o valor a ser testado.
 * @returns um boolean indicando se o número é válido.
 */
export const isNumber = (num: any):boolean =>
{
    if(num && isNaN(parseInt(num)))
        return false;
    else if(isNaN(num))
        return false;
    return true;
};

/**
 * Verifica se é um array e se ele está vazio.
 * @param array - o array a ser testado
 * @returns um boolean. Retorna true se ele estiver vazio e false se não for array ou se tiver dados.
 */
export const arrayIsEmpty = (array:any) =>
{
    if (!Array.isArray(array))
        return false;

    if (array.length == 0)
        return true;

    return false;
};

/**
 * Verifica se a data é válida.
 * @param dateString - a data a ser testada.
 * @returns boolean indicando se a data é válida.
 */
export const isValidDate = (dateString: string): boolean =>
{
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // (janeiro = 0)
    const day = parseInt(dateParts[2]);
  
    const date = new Date(year, month, day);
  
    // Verificar se o ano, mês e dia são iguais aos fornecidos pelo usuário
    return ( date.getFullYear() === year && date.getMonth() === month && date.getDate() === day );
};

/**
 * Verifica se o id é um número válido.
 * @param id - o id a ser testado.
 * @returns retorna o id se ele for válido.
 */
export const checkId = (id: any) =>
{
    if(id && !isNumber(id))
        throw new BadRequestError(errMsg.INVALID_ID);

    return id;
};

/**
 * Formata a data para o padrão brasileiro.
 * @param data - a data do tipo Date a ser formatada. 
 * @returns a data no formato dia/mês/ano.
 */
export const dataFormatToBR = (data: Date) => 
{
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = String(data.getFullYear());
    
    return `${dia}/${mes}/${ano}`;
}; 

/**
 * Remove todos os caracteres não numéricos do número telefônico.
 * @param phone - um número telefônico
 * @returns o telefône contendo apenas os números
 */
export const phoneFormat = (phone: string) => 
{ 
    if (phone)
        return phone.replace(/\D/g, ""); 
    return null;
};

