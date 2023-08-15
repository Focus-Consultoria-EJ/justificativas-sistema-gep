import ServicoRepository from "../../../database/repositories/precificacao/ServicoRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";

class getByIdServicoService 
{
    /**
     * Serviço responsável por trazer um serviço através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await ServicoRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.SERVICO.NOT_FOUND); 

        return result;
    }
}

export default new getByIdServicoService;