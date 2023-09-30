import { TableNames } from "./TableNames";
import db from "./db";

/**
 * Verifica se o item já existe em uma ou mais colunas da tabela.
 * @param dbTableName - uma tabela do banco de dados
 * @param col - um array de string com uma ou mais colunas da tabela a ser verificada.
 * @param value - um array de valor de string com uma ou mais para verificar as duplicatas.
 * @returns true se já existe.
 */
export const valueAlreadyExistsInColumn = async (dbTableName: TableNames, col: string[], value: any[]) => 
{
    try
    {
        if((col.length !== value.length) || col.length === 0 || value.length === 0)
            throw new Error("O tamanho da coluna é diferente do valor na função 'valueAlreadyExistsInColumn'.");

        let query = db(dbTableName)
            .where({ [col[0]]: value[0] });
            
        // Se houver mais de uma coluna/valor, faz o andWhere com os outros itens
        if(col.length > 1)
        {
            for(let i = 1; i < col.length; i++)
                query = query.andWhere({ [col[i]]: value[i]});
        }
            
        const result = await query.first();
       
        if(!result)
            return false;
        else
            return true;
    }
    catch (err) { throw new Error(String(err)); }
};