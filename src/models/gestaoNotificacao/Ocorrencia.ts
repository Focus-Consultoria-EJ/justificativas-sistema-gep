import { Shark } from "../Shark";
import { NivelAdvertencia } from "./NivelAdvertencia";
import { NivelGratificacao } from "./NivelGratificacao";
import { TipoAssunto } from "./TipoAssunto";
import { TipoOcorrencia } from "./TipoOcorrencia";

export interface Ocorrencia
{
    id: number;
    dataOcorrido: string;
    tipoOcorrencia: TipoOcorrencia;
    tipoAssunto: TipoAssunto;
    mensagem: string;
    valorMetragem: number;
    nivelAdvertencia?: NivelAdvertencia;
    nivelGratificacao?: NivelGratificacao;
    sharkCriador?: Shark;
    sharkReferente: Shark;
    dataCriacao?: Date;
}

export interface LogOcorrencia
{
    id?: number;
    tipoAcaoLog?: { id: number, nome: string };
    ocorrencia?: Ocorrencia;
    sharkEditor?: Shark;
    dataAcao?: Date;
}