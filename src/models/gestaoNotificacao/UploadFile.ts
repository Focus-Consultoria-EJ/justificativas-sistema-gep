import { Ocorrencia } from "./Ocorrencia";

export interface UploadFile
{
    id?: number;
    googleDriveId?: string;
    nomeArquivo?: string;
    tipoArquivo?: string;
    ocorrencia?: Ocorrencia;
    dataCriacao?: Date;
}
