import { InternalServerError } from "../../../middlewares/Error.middleware";
import { NivelGratificacao } from "../../../models/gestaoNotificacao/NivelGratificacao";
import { TableNames } from "../../TableNames";
import db from "../../db";

class NivelGratificacaoRepository
{
    /**
     * Traz todos os dados da tabela nivel_gratificacao no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<NivelGratificacao[] | undefined>
    {
        try
        {
            const data = await db(TableNames.nivel_gratificacao).orderBy("id");

            const niveisGratificacao: NivelGratificacao[] = data.map(nivelGratificacao => ({
                id: nivelGratificacao.id,
                nome: nivelGratificacao.nome,
                valor: nivelGratificacao.valor
            }));

            return niveisGratificacao;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }   
    
    /**
     * Traz uma linha da tabela nivel_gratificacao no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<NivelGratificacao | undefined>
    {
        try
        {
            const data = await db(TableNames.nivel_gratificacao)
                .where({ id: id })
                .first();

            if(!data)
                return undefined;
            
            return { id: data.id, nome: data.nome, valor: data.valor };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Verifica se o nome e o valor já existe na tabela nivel_gratificacao.
     * @param nome - o texto do nível de gratificação em uma ocorrência.
     * @param valor - o valor associado ao nome do nível de gratificação.
     * @returns uma promise do tipo boolean. 
     */
    async existsByNameAndValue(nome: string, valor: number): Promise<boolean | undefined>
    {
        const result = await db(TableNames.nivel_gratificacao)
            .where({ nome: nome })
            .andWhere({ valor: valor })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    /**
     * Insere o item na tabela nivel_gratificacao no banco de dados.
     * @param nivelGratificacao - um objeto do tipo NivelGratificacao.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(nivelGratificacao: NivelGratificacao): Promise<any | undefined>
    {
        return await db(TableNames.nivel_gratificacao).insert({
            nome: nivelGratificacao.nome,
            valor: nivelGratificacao.valor
        });
    }

    /**
     * Atualiza o item na tabela nivel_gratificacao no banco de dados.
     * @param nivelGratificacao - um objeto do tipo NivelGratificacao.
     * @returns - uma promise com as informações da atualização.
     */
    async update(nivelGratificacao: NivelGratificacao): Promise<any | undefined>
    {
        return await db(TableNames.nivel_gratificacao)
            .update({
                nome: nivelGratificacao.nome,
                valor: nivelGratificacao.valor
            })
            .where({ id: nivelGratificacao.id });
    }

    /**
     * Remove o item na tabela nivel_gratificacao no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.nivel_gratificacao)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new NivelGratificacaoRepository;

