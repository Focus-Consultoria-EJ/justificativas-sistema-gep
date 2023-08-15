import { Cliente } from "./Cliente";
import { Servico } from "./Servico";
import { TipoPreco } from "./TipoPreco";

export interface Precificacao
{
    id?: number;
    composta?: boolean;
    servico?: Servico;
    servicoComposto?: Servico;
    cliente?: Cliente;
    tipoNegocio?: string;
    margemIncerteza?: number;
    qtdMembros?: number;
    custoVariavel?: number;
    modalidade?: string;
    tipoPreco?: TipoPreco;
    entrada?: number;
    parcelado?: number;
    valorParcelas?: number;
    valorAVista?: number;
    dataCriacao?: Date;
}