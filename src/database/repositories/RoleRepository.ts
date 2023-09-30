import { InternalServerError } from "../../middlewares/Error.middleware";
import { Role } from "../../models/Role";
import { TableNames } from "../TableNames";
import db from "../db";

class CelulaRepository
{
    /**
     * Traz uma linha da tabela role no banco de dados de acordo com o id
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Role | undefined>
    {
        try
        {
            const data =  await db(TableNames.role)
                .where({ id: id })
                .first();
            
            if(!data)
                return undefined;

            return { id: data.id, nome: data.nome };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }
}

export default new CelulaRepository;

