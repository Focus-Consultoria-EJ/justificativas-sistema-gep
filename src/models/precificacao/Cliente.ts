import { PorteCliente } from "./PorteCliente";

export interface Cliente
{
    id?: number;
    nome?: string;
    nomeEmpresa?: string;
    tipoCliente?: string;
    idade?: string;
    negociador?: string;
    estado?: string;
    cidade?: string;
    sexo?: string;  
    porteCliente?: PorteCliente;
    dataCriacao?: Date;
}