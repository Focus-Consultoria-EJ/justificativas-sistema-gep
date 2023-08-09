import { Celula } from "./Celula";
import { Role } from "./Role";
import { DistanciaResidencia } from "./gestaoNotificacao/DistanciaResidencia";

export interface Shark
{
    id?: number;
    nome: string;
    email: string;
    emailPessoal?: string;
    telefone?: string;
    distancia?: DistanciaResidencia; // id DistanciaResidencia
    cpf?: string;
    matricula?: string;
    senha?: string;
    celula: Celula; // id Celula
    numProjeto?: number;
    metragem?: number;
    role?: Role;
    membroAtivo?: number;
    dataCriacao?: Date;
}