import DistanciaResidenciaRepository from "../../database/repositories/DistanciaResidenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdDistanciaPercorridaService 
{
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