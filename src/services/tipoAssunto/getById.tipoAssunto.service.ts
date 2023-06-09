import TipoAssuntoRepository from "../../database/repositories/TipoAssuntoRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdTipoAssuntoService 
{
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await TipoAssuntoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.TIPO_ASSUNTO.NOT_FOUND); 

        return result;
    }
}

export default new getByIdTipoAssuntoService;