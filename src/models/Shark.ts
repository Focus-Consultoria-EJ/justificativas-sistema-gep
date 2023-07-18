import { Celula } from "./Celula";
import { DistanciaResidencia } from "./DistanciaResidencia";

export interface Shark
{
    id?: number;
    nome: string;
    email: string;
    telefone?: string;
    distancia?: DistanciaResidencia; // id DistanciaResidencia
    cpf?: string;
    matricula?: string;
    senha?: string;
    celula: Celula; // id Celula
    numProjeto?: number;
    metragem?: number;
    admin?: number;
    membroAtivo?: number;
    dataCriacao?: Date;
}