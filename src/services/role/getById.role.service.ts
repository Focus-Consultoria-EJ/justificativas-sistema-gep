import RoleRepository from "../../database/repositories/RoleRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";

class getByIdRoleService 
{
    /**
     * Serviço responsável por trazer uma role através do id.
     * @param id - identificador relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(id:any)
    {
        id = checkId(id);
        
        const result = await RoleRepository.getById(id);
        
        if(!result)
            throw new BadRequestError(errMsg.ROLE.NOT_FOUND); 

        return result;
    }
}

export default new getByIdRoleService;