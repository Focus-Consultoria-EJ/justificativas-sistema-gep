/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadRequestError, CustomError } from "../middlewares/Error.middleware";
import { errMsg } from "./ErrorMessages";

const valueExists = (value: any, msg: string): void => 
{
    if(!value) throw new CustomError(msg, 400);
    if(Array.isArray(value) && value.length === 0) throw new CustomError(msg, 400);
    if(typeof value === "string" && !value.trim()) throw new CustomError(msg, 400);
};

export const emailValidation = (email:string) =>
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isNumber = (num: any):boolean =>
{
    if(num && isNaN(parseInt(num)))
        return false;
    else if(isNaN(num))
        return false;
    return true;
};

export const arrayIsEmpty = (array:any) =>
{
    if (!Array.isArray(array))
        return false;

    if (array.length == 0)
        return true;

    return false;
};

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

export const checkId = (id: any) =>
{
    if(id && !isNumber(id))
        throw new BadRequestError(errMsg.INVALID_ID);

    return id;
};

export  { valueExists, isNumber };

    
