import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdTipoOcorrenciaService 
{
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await TipoOcorrenciaRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.TIPO_OCORRENCIA.NOT_FOUND); 

        return result;
    }
}

export default new getByIdTipoOcorrenciaService;