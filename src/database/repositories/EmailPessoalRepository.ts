import { InternalServerError } from "../../middlewares/Error.middleware";
import { TableNames } from "../TableNames";
import db from "../db";

class EmailPessoalRepository
{
    /**
     * Verifica se um usuário existe de acordo com um campo.
     * @param col - uma coluna da tabela email_pessoal no banco de dados.
     * @param data - o valor da coluna da tabela email_pessoal no banco de dados.
     * @returns uma promise do tipo boolean.
     */
    async userExists(col: string, data:string): Promise<boolean>
    {
        if( col === "email" )
        {
            const result = await db(TableNames.email_pessoal)
                .where({ [col]: data })
                .first();
            
            if(!result)
                return false;
            else
                return true;
        }
        else
        {
            const instance = new EmailPessoalRepository();
            throw new InternalServerError("Erro na classe: " + instance.constructor.name + " a coluna '" + col + "' não existe.");
        }
    }

    /**
     * Verifica se a coluna e a informação a ser verificada é do usuário identificado pelo id.
     * @param id - o identificador do shark.
     * @param col - uma coluna da tabela email_pessoal no banco de dados.
     * @param data - o valor da coluna da tabela email_pessoal no banco de dados.
     * @returns uma promise do tipo boolean.
     */
    async verifyIfDataIsFromOwnUser(id: number, col: string, data:string): Promise<boolean>
    {
        if( col === "email" )
        {
            const result = await db.raw(`SELECT * FROM ${TableNames.email_pessoal} WHERE id_shark = ${id} AND ${col} = '${data}';`)
                .then(result => { return result.rows; }); // ignora os buffers

            // Retorna true se o usuário for dono
            if(result.length)
                return true;
            else
                return false;
        }
        else
        {
            const instance = new EmailPessoalRepository();
            throw new InternalServerError("Erro na classe: " + instance.constructor.name + " a coluna '" + col + "' não existe.");
        }
    }

    /**
     * Remove o item na tabela celula no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.email_pessoal)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new EmailPessoalRepository;

