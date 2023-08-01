import NivelAdvertenciaRepository from "../../../database/repositories/gestaoNotificacao/NivelAdvertenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdNivelAdvertenciaService 
{
    /**
     * Serviço responsável por Trazer um nível de advertência através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await NivelAdvertenciaRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.NIVEL_ADVERTENCIA.NOT_FOUND); 

        return result;
    }
}

export default new GetByIdNivelAdvertenciaService;