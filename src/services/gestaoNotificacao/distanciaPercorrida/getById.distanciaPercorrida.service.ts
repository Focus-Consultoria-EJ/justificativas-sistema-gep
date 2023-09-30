import DistanciaResidenciaRepository from "../../../database/repositories/gestaoNotificacao/DistanciaResidenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class getByIdDistanciaPercorridaService 
{
    /**
     * Serviço responsável por Trazer uma distãncia através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await DistanciaResidenciaRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.DISTANCIA.NOT_FOUND); 

        return result;
    }
}

export default new getByIdDistanciaPercorridaService;