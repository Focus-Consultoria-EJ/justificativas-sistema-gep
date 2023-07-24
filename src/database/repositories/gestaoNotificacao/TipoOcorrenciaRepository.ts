import { InternalServerError } from "../../../middlewares/Error.middleware";
import { TipoOcorrencia } from "../../../models/gestaoNotificacao/TipoOcorrencia";
import { TableNames } from "../../TableNames";
import db from "../../db";

class TipoOcorrenciaRepository
{
    
    /**
     * Traz todos os dados da tabela tipo_ocorrencia no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<TipoOcorrencia[] | undefined>
    {
        try
        {
            const data = await db(TableNames.tipo_ocorrencia).orderBy("id");

            const tipoOcorrencias: TipoOcorrencia[] = data.map(tipoOcorrencia => ({
                id: tipoOcorrencia.id,
                nome: tipoOcorrencia.nome
            }));

            return tipoOcorrencias;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }   
    
    /**
     * Traz uma linha da tabela tipo_ocorrencia no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<TipoOcorrencia | undefined>
    {
        try
        {
            const data = await db(TableNames.tipo_ocorrencia)
                .where({ id: id })
                .first();
            
            if(!data)
                return undefined;
            
            return { id: data.id, nome: data.nome };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Verifica se o nome já existe na tabela tipo_ocorrencia.
     * @param nome - o texto do tipo de ocorrência em uma ocorrência.
     * @returns uma promise do tipo boolean. 
     */
    async existsByName(nome: string): Promise<any | undefined>
    {
        const result = await db(TableNames.tipo_ocorrencia)
            .where({ nome: nome })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    /**
     * Insere o item na tabela tipo_ocorrencia no banco de dados.
     * @param tipoOcorrencia - um objeto do tipo TipoOcorrencia.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(tipoOcorrencia: TipoOcorrencia): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia).insert({
            nome: tipoOcorrencia.nome
        });
    }

    /**
     * Atualiza o item na tabela tipo_ocorrencia no banco de dados.
     * @param tipoOcorrencia - um objeto do tipo TipoOcorrencia.
     * @returns - uma promise com as informações da atualização.
     */
    async update(tipoOcorrencia: TipoOcorrencia): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia)
            .update({
                nome: tipoOcorrencia.nome
            })
            .where({ id: tipoOcorrencia.id })
            // Impede de atualizar os índices de 1 a 7 na tabela.
            .andWhereNotBetween("id", [1, 7]);
    }

    /**
     * Remove o item na tabela tipo_ocorrencia no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia)
            .select()
            .where({ id: id })

            // Impede de deletar os índices de 1 a 7 na tabela
            .andWhereNotBetween("id", [1, 7])
            .del();
    }
}

export default new TipoOcorrenciaRepository;

