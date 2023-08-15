import { InternalServerError } from "../middlewares/Error.middleware";
import { TableNames } from "./TableNames";
import db from "./db";

/**
 * Verifica se o item já existe em uma coluna da tabela.
 * @param dbTableName - uma tabela do banco de dados
 * @param col - a coluna da tabela a ser verificada.
 * @param value - o valor a verificar duplicatas.
 * @returns true se já existe.
 */
export const valueAlreadyExistsInColumn = async (dbTableName: TableNames, col: string, value: string) => 
{
    try
    {
        const result = await db(dbTableName)
            .where({ [col]: value })
            .first();

        if(!result)
            return false;
        else
            return true;
    }
    catch (err) { throw new InternalServerError(String(`Erro no SELECT de serviços: ${err}`)); }
};