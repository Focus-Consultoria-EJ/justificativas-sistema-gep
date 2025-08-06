import { InternalServerError } from "../../../middlewares/Error.middleware";
import { NivelAdvertencia } from "../../../models/gestaoNotificacao/NivelAdvertencia";
import { TableNames } from "../../TableNames";
import db from "../../db";

class NivelAdvertenciaRepository
{
    /**
     * Traz todos os dados da tabela nivel_advertencia no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<NivelAdvertencia[] | undefined>
    {
        try
        {
            const data = await db(TableNames.nivel_advertencia).orderBy("id");

            const niveisAdvertencia: NivelAdvertencia[] = data.map(nivelAdvertencia => ({
                id: nivelAdvertencia.id,
                nome: nivelAdvertencia.nome,
                valor: nivelAdvertencia.valor
            }));

            return niveisAdvertencia;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }   
    
    /**
     * Traz uma linha da tabela nivel_advertencia no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<NivelAdvertencia | undefined>
    {
        try
        {
            const data = await db(TableNames.nivel_advertencia)
                .where({ id: id })
                .first();

            if(!data)
                return undefined;
            
            return { id: data.id, nome: data.nome, valor: data.valor };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Verifica se o nome e o valor já existe na tabela nivel_advertencia.
     * @param nome - o texto do nível de advertência em uma ocorrência.
     * @param valor - o valor associado ao nome do nível de advertência.
     * @returns uma promise do tipo boolean. 
     */
    async existsByNameAndValue(nome: string, valor: number): Promise<boolean | undefined>
    {
        const result = await db(TableNames.nivel_advertencia)
            .where({ nome: nome })
            .andWhere({ valor: valor })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    /**
     * Insere o item na tabela nivel_advertencia no banco de dados.
     * @param nivelAdvertencia - um objeto do tipo NívelAdvertencia.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(nivelAdvertencia: NivelAdvertencia): Promise<any | undefined>
    {
        return await db(TableNames.nivel_advertencia).insert({
            nome: nivelAdvertencia.nome,
            valor: nivelAdvertencia.valor
        });
    }

    /**
     * Atualiza o item na tabela nivel_advertencia no banco de dados.
     * @param nivelAdvertencia - um objeto do tipo NívelAdvertencia.
     * @returns - uma promise com as informações da atualização.
     */
    async update(nivelAdvertencia: NivelAdvertencia): Promise<any | undefined>
    {
        return await db(TableNames.nivel_advertencia)
            .update({
                nome: nivelAdvertencia.nome,
                valor: nivelAdvertencia.valor
            })
            .where({ id: nivelAdvertencia.id });
    }

    /**
     * Remove o item na tabela nivel_advertencia no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.nivel_advertencia)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new NivelAdvertenciaRepository;

