import db from "../../db";
import { TableNames } from "../../TableNames";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { valueAlreadyExistsInColumn } from "../../commonQuerys";
import { PorteCliente } from "../../../models/precificacao/PorteCliente";

class PorteClienteRepository
{
    /**
     * Traz todos os dados da tabela porte_cliente no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<PorteCliente[] | undefined>
    {
        try
        {
            const data = await db(TableNames.porte_cliente).orderBy("id");

            const servicos: PorteCliente[] = data.map(data => (
                { id: data.id, tipo: data.tipo, desconto: data.desconto }
            ));

            return servicos;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }   

    /**
     * Traz uma linha da tabela porte_cliente no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<PorteCliente | undefined>
    {
        try
        {
            const data = await db(TableNames.porte_cliente)
                .where({ id: id })
                .first();

            if(!data)
                return undefined;

            return { id: data.id, tipo: data.tipo, desconto: data.desconto };
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }

    /**
     * Verifica se o nome já existe na tabela serviço.
     * @param nome - o nome do serviço.
     * @returns uma promise do tipo boolean. 
     */
    async existsByTipoEDesconto(tipo: string, desconto: number): Promise<boolean | undefined>
    {
        return await valueAlreadyExistsInColumn(TableNames.porte_cliente, ["tipo", "desconto"], [tipo, desconto])
            .catch(err => { 
                throw new InternalServerError(String(`Erro em ${this.constructor.name}. ${err.message}`)); 
            });
    }

    /**
     * Insere o item na tabela porte_cliente no banco de dados.
     * @param servico - um objeto do tipo PorteCliente.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(porte: PorteCliente): Promise<any | undefined>
    {
        return await db(TableNames.porte_cliente).insert({ tipo: porte.tipo, desconto: porte.desconto });
    }

    /**
     * Atualiza o item na tabela porte_cliente no banco de dados.
     * @param servico - um objeto do tipo PorteCliente.
     * @returns - uma promise com as informações da atualização.
     */
    async update(porte: PorteCliente): Promise<any | undefined>
    {
        return await db(TableNames.porte_cliente)
            .update({ tipo: porte.tipo, desconto: porte.desconto })
            .where({ id: porte.id });
    }

    /**
     * Remove o item na tabela porte_cliente no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.porte_cliente)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new PorteClienteRepository;

