import PorteClienteRepository from "../../../database/repositories/precificacao/PorteClienteRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdPorteClienteService 
{
    /**
     * Serviço responsável por trazer um porte de cliente através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await PorteClienteRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.PORTE_CLIENTE.NOT_FOUND); 

        return result;
    }
}

export default new GetByIdPorteClienteService;