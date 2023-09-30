import db from "../../db";
import { TableNames } from "../../TableNames";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { Servico } from "../../../models/precificacao/Servico";
import { valueAlreadyExistsInColumn } from "../../commonQuerys";
class ServicoRepository
{
    /**
     * Traz todos os dados da tabela servico no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<Servico[] | undefined>
    {
        try
        {
            const data = await db(TableNames.servico).orderBy("id");

            const servicos: Servico[] = data.map(data => ({ id: data.id, nome: data.nome }));

            return servicos;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }   

    /**
     * Traz uma linha da tabela servico no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Servico | undefined>
    {
        try
        {
            const data = await db(TableNames.servico)
                .where({ id: id })
                .first();

            if(!data)
                return undefined;

            return { id: data.id, nome: data.nome };
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }

    /**
     * Verifica se o nome já existe na tabela serviço.
     * @param nome - o nome do serviço.
     * @returns uma promise do tipo boolean. 
     */
    async existsByName(nome: string): Promise<boolean | undefined>
    {
        return await valueAlreadyExistsInColumn(TableNames.servico, ["nome"], [nome])
            .catch(err => { 
                throw new InternalServerError(String(`Erro em ${this.constructor.name}. ${err.message}`)); 
            });
    }

    /**
     * Insere o item na tabela servico no banco de dados.
     * @param servico - um objeto do tipo Servico.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(servico: Servico): Promise<any | undefined>
    {
        return await db(TableNames.servico).insert({ nome: servico.nome });
    }

    /**
     * Atualiza o item na tabela servico no banco de dados.
     * @param servico - um objeto do tipo Servico.
     * @returns - uma promise com as informações da atualização.
     */
    async update(servico: Servico): Promise<any | undefined>
    {
        return await db(TableNames.servico)
            .update({ nome: servico.nome })
            .where({ id: servico.id });
    }

    /**
     * Remove o item na tabela servico no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.servico)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new ServicoRepository;

