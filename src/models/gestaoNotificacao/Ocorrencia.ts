import { Shark } from "../Shark";
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
    sharkCriador?: Shark;
    sharkReferente: Shark;
    dataCriacao?: Date;
}