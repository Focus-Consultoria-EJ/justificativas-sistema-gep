import { Celula } from "../../models/Celula";
import { TableNames } from "../TableNames";
import db from "../db";

class CelulaRepository
{
    /**
     * Traz todos os dados da tabela celula no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<Celula[] | undefined>
    {
        return await db(TableNames.celula).orderBy("id");
    }   
    
    /**
     * Traz uma linha da tabela celula no banco de dados de acordo com o id
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Celula | undefined>
    {
        return await db(TableNames.celula)
            .where({ id: id })
            .first();
    }

    /**
     * Verifica se o nome já existe na tabela celula.
     * @param nome - o nome da celula.
     * @returns uma promise do tipo boolean. 
     */
    async existsByName(nome: string): Promise<boolean | undefined>
    {
        const result = await db(TableNames.celula)
            .where({ nome: nome })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    /**
     * Insere o item na tabela celula no banco de dados.
     * @param celula - um objeto do tipo Celula.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(celula: Celula): Promise<any | undefined>
    {
        return await db(TableNames.celula).insert({
            nome: celula.nome
        });
    }

    /**
     * Atualiza o item na tabela celula no banco de dados.
     * @param celula - um objeto do tipo Celula.
     * @returns - uma promise com as informações da atualização.
     */
    async update(celula: Celula): Promise<any | undefined>
    {
        return await db(TableNames.celula)
            .update({
                nome: celula.nome
            })
            .where({ id: celula.id })

            // Impede de atualizar os índices de 1 a 6 na tabela.
            .andWhereNotBetween("id", [1, 6]);
    }
    
    /**
     * Remove o item na tabela celula no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.celula)
            .select()
            .where({ id: id })

            // Impede de deletar os índices de 1 a 6 na tabela
            .andWhereNotBetween("id", [1, 6])
            .del();
    }
}

export default new CelulaRepository;

