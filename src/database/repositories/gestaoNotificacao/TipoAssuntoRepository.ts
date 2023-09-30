import { InternalServerError } from "../../../middlewares/Error.middleware";
import { TipoAssunto } from "../../../models/gestaoNotificacao/TipoAssunto";
import { TableNames } from "../../TableNames";
import db from "../../db";

class TipoAssuntoRepository
{
    /**
     * Traz todos os dados da tabela tipo_assunto no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<TipoAssunto[] | undefined>
    {
        try
        {
            const data = await db(TableNames.tipo_assunto).orderBy("id");

            const tipoAssuntos: TipoAssunto[] = data.map(tipoAssunto => ({
                id: tipoAssunto.id,
                nome: tipoAssunto.nome
            }));

            return tipoAssuntos;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }   
    
    /**
     * Traz uma linha da tabela tipo_assunto no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<TipoAssunto | undefined>
    {
        try
        {
            const data = await db(TableNames.tipo_assunto)
                .where({ id: id })
                .first();

            if(!data)
                return undefined;
            
            return { id: data.id, nome: data.nome };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Verifica se o nome já existe na tabela tipo_assunto.
     * @param nome - o texto do tipo de assunto em uma ocorrência.
     * @returns uma promise do tipo boolean. 
     */
    async existsByName(nome: string): Promise<boolean | undefined>
    {
        const result = await db(TableNames.tipo_assunto)
            .where({ nome: nome })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    /**
     * Insere o item na tabela tipo_assunto no banco de dados.
     * @param tipoAssunto - um objeto do tipo TipoAssunto.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(tipoAssunto: TipoAssunto): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto).insert({
            nome: tipoAssunto.nome
        });
    }

    /**
     * Atualiza o item na tabela tipo_assunto no banco de dados.
     * @param tipoAssunto - um objeto do tipo TipoAssunto.
     * @returns - uma promise com as informações da atualização.
     */
    async update(tipoAssunto: TipoAssunto): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto)
            .update({
                nome: tipoAssunto.nome
            })
            .where({ id: tipoAssunto.id });
    }

    /**
     * Remove o item na tabela tipo_assunto no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new TipoAssuntoRepository;

