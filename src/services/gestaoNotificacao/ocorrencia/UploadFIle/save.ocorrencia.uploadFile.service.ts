import { removeFileFromDrive, uploadFileToDrive } from "../../../../config/googleAPI";
import { BadRequestError, InternalServerError } from "../../../../middlewares/Error.middleware";
import UploadFileRepository from "../../../../database/repositories/gestaoNotificacao/UploadFileRepository";
import { Ocorrencia } from "../../../../models/gestaoNotificacao/Ocorrencia";

class SaveOcorrenciaUploadFileService 
{
    /**
     * Insere os dados do arquivo no banco de dados upload_file e faz o upload para o google drive
     * @param file - o arquivo a ser feito o upload.
     * @returns returno um objeto contendo o id do google e o nome do arquivo inserido
     */
    async uploadFile(file: Express.Multer.File)
    {
        const dataFile = await uploadFileToDrive(file)
            .then(data => data.idGoogle ? data : 0)
            .catch(err => { throw new InternalServerError(`Erro: ${err}`); });

        if(dataFile === 0)
            throw new BadRequestError("Não foi possível fazer upload do arquivo.");

        return dataFile;
    }

    async execute(file: Express.Multer.File, ocorrencia: Ocorrencia, isUpdate = false)
    {
        if(isUpdate)
        {
            const dataFile = await UploadFileRepository.getByIdOcorrencia(ocorrencia.id);
            
            if(dataFile)
            {
                return await removeFileFromDrive(String(dataFile.googleDriveId))
                    .then(async () => {
                        const updatedFile = await this.uploadFile(file);

                        return await UploadFileRepository.update({
                            id: dataFile.id,
                            googleDriveId: updatedFile.idGoogle!,
                            nomeArquivo: updatedFile.filename,
                            tipoArquivo: file.mimetype,
                            ocorrencia: ocorrencia
                        });
                    });
            }
            else
            {
                const updatedFile = await this.uploadFile(file);

                return await UploadFileRepository.insert({
                    googleDriveId: updatedFile.idGoogle!,
                    nomeArquivo: updatedFile.filename,
                    tipoArquivo: file.mimetype,
                    ocorrencia: ocorrencia
                });
            }     
        }
        else
        {
            const updatedFile = await this.uploadFile(file);

            await UploadFileRepository.insert({
                googleDriveId: updatedFile.idGoogle!,
                nomeArquivo: updatedFile.filename,
                tipoArquivo: file.mimetype,
                ocorrencia: ocorrencia
            });
        }
    }
}
export default new SaveOcorrenciaUploadFileService;