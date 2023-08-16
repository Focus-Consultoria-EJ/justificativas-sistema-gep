import db from "../../db";
import { TableNames } from "../../TableNames";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { valueAlreadyExistsInColumn } from "../../commonQuerys";
import { TipoPreco } from "../../../models/precificacao/TipoPreco";

class ServicoRepository
{
    /**
     * Traz todos os dados da tabela tipo_preco no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<TipoPreco[] | undefined>
    {
        try
        {
            const data = await db(TableNames.tipo_preco).orderBy("id");

            const tipoPrecos: TipoPreco[] = data.map(data => ({ id: data.id, nome: data.nome }));

            return tipoPrecos;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }   

    /**
     * Traz uma linha da tabela tipo_preco no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<TipoPreco | undefined>
    {
        try
        {
            const data = await db(TableNames.tipo_preco)
                .where({ id: id })
                .first();

            if(!data)
                return undefined;

            return { id: data.id, nome: data.nome };
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }

    /**
     * Verifica se o nome já existe na tabela tipo_preco.
     * @param nome - o nome do preço.
     * @returns uma promise do tipo boolean. 
     */
    async existsByName(nome: string): Promise<boolean | undefined>
    {
        return await valueAlreadyExistsInColumn(TableNames.tipo_preco, ["nome"], [nome])
            .catch(err => { 
                throw new InternalServerError(String(`Erro em ${this.constructor.name}. ${err.message}`)); 
            });
    }

    /**
     * Insere o item na tabela tipo_preco no banco de dados.
     * @param tipoPreco - um objeto do tipo TipoPreco.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(tipoPreco: TipoPreco): Promise<any | undefined>
    {
        return await db(TableNames.tipo_preco).insert({ nome: tipoPreco.nome });
    }

    /**
     * Atualiza o item na tabela tipo_preco no banco de dados.
     * @param tipoPreco - um objeto do tipo TipoPreco.
     * @returns - uma promise com as informações da atualização.
     */
    async update(tipoPreco: TipoPreco): Promise<any | undefined>
    {
        return await db(TableNames.tipo_preco)
            .update({ nome: tipoPreco.nome })
            .where({ id: tipoPreco.id });
    }

    /**
     * Remove o item na tabela tipo_preco no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_preco)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new ServicoRepository;

