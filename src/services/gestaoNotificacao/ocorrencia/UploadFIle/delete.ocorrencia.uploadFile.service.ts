import { removeFileFromDrive } from "../../../../config/googleAPI";
import UploadFileRepository from "../../../../database/repositories/gestaoNotificacao/UploadFileRepository";
import { checkId } from "../../../../helpers/validation";
import { InternalServerError } from "../../../../middlewares/Error.middleware";

class DeleteOcorrenciaUploadFileService  
{
    /**
     * Serviço responsável pela remoção de um arquivo do google drive (caso exista) e da tabela upload_file 
     * através do id da ocorrência associada.
     * @param id - o identificador do índice a ser removido.
     * @param reqShark - os dados do shark salvo na requisição do Express. 
     */
    async execute(idOcorrencia: any): Promise<void>
    {
        idOcorrencia = checkId(idOcorrencia);

        const dataFile = await UploadFileRepository.getByIdOcorrencia(idOcorrencia);

        // Apaga o arquivo caso ele exita
        if(dataFile)
        {
            await UploadFileRepository.delete(dataFile.id!)
                .then(async () => { await removeFileFromDrive(dataFile.googleDriveId!); })
                .catch(err => { throw new InternalServerError(`Erro: ${err}`); });
        }
    }
}

export default new DeleteOcorrenciaUploadFileService ;