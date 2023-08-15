import { TotalCusto } from "./TotalCusto";

export interface Custo
{
    id?: number;
    nome?: string;
    mesInicio?: string;
    quantidade?: number;
    preco?: number;
    numeroDias?: number;
    valido?: boolean;
    justificativa?: string;
    totalCusto?: TotalCusto;
}