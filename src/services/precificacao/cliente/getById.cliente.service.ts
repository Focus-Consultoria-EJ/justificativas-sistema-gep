import ClienteRepository from "../../../database/repositories/precificacao/ClienteRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class GetByIdClienteService 
{
    /**
     * Serviço responsável por trazer um cliente através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await ClienteRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.CLIENTE.NOT_FOUND); 

        return result;
    }
}

export default new GetByIdClienteService;