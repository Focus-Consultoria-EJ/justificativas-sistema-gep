import UploadFileRepository from "../../../../database/repositories/gestaoNotificacao/UploadFileRepository";
import { arrayIsEmpty, checkId } from "../../../../helpers/validation";
import { BadRequestError } from "../../../../middlewares/Error.middleware";

class GetByIdOcorrenciaUploadFileService 
{
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await UploadFileRepository.getByIdOcorrencia(id);

        if(!result || arrayIsEmpty(result))
            throw new BadRequestError("Arquivo de upload não encontrado."); 

        return result;
    }
}

export default new GetByIdOcorrenciaUploadFileService;