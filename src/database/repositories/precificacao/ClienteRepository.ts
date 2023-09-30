import db from "../../db";
import { TableNames } from "../../TableNames";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { valueAlreadyExistsInColumn } from "../../commonQuerys";
import { Cliente } from "../../../models/precificacao/Cliente";
import { orderByParameter, pageParameter, sizeParameter } from "../../Parameters";

class ClienteRepository
{
    /**
     * Traz todos os dados da tabela cliente no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(size?: number, page?: number, order?: string): Promise<Cliente[] | undefined>
    {
        try
        {
            page = pageParameter(page);
            size = sizeParameter(size);
            order = orderByParameter(order);

            let query = db(TableNames.cliente)
                .select(
                    "c.id",
                    "c.nome",
                    "c.nome_empresa",
                    "c.idade",
                    "c.negociador",
                    "c.estado",
                    "c.cidade",
                    "c.sexo",
                    "pc.id as id_porte_cliente",
                    "pc.tipo as tipo_porte_cliente",
                    "pc.desconto as desconto_porte_cliente",
                    "c.data_criacao"
                )
                .from(`${TableNames.cliente} as c`)
                .innerJoin(`${TableNames.porte_cliente} as pc`, "c.id_porte_cliente", "pc.id");

            if(size) query = query.limit(size);
            if(page) query = query.offset(page);

            const data = await query.orderBy("c.id", order);

            const clientes: Cliente[] = data.map(data => ({ 
                id: data.id, 
                nome: data.nome,
                nomeEmpresa: data.nome_empresa,
                tipoCliente: data.tipo_cliente,
                idade: data.idade,
                negociador: data.negociador,
                estado: data.estado,
                cidade: data.cidade,
                sexo: data.sexo,
                porteCliente: { id: data.id_porte_cliente, tipo: data.tipo_porte_cliente, desconto: data.desconto_porte_cliente },
                dataCriacao: data.data_criacao 
            }));

            return clientes;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }   

    /**
     * Traz uma linha da tabela cliente no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Cliente | undefined>
    {
        try
        {
            const data = await db(TableNames.cliente)
                .select(
                    "c.id",
                    "c.nome",
                    "c.nome_empresa",
                    "c.idade",
                    "c.negociador",
                    "c.estado",
                    "c.sexo",
                    "pc.id as id_porte_cliente",
                    "pc.tipo as tipo_porte_cliente",
                    "pc.desconto as desconto_porte_cliente",
                    "c.data_criacao"
                )
                .from(`${TableNames.cliente} as c`)
                .innerJoin(`${TableNames.porte_cliente} as pc`, "c.id_porte_cliente", "pc.id")
                .andWhere("c.id", "=", id)
                .first();

            if(!data)
                return undefined;

            return { 
                id: data.id, 
                nome: data.nome,
                nomeEmpresa: data.nome_empresa,
                tipoCliente: data.tipo_cliente,
                idade: data.idade,
                negociador: data.negociador,
                estado: data.estado,
                cidade: data.cidade,
                sexo: data.sexo,
                porteCliente: { id: data.id_porte_cliente, tipo: data.tipo_porte_cliente, desconto: data.desconto_porte_cliente },
                dataCriacao: data.data_criacao 
            };
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }

    /**
     * Verifica se o nome do cliente e o nome da empresa já existem na tabela cliente.
     * @param nome - o nome do cliente.
     * @param nomeEmpresa - o nome da empresa.
     * @returns uma promise do tipo boolean. 
     */
    async alreadyExists(nome: string, nomeEmpresa: string): Promise<boolean | undefined>
    {
        return await valueAlreadyExistsInColumn(TableNames.cliente, ["nome", "nome_empresa"], [nome, nomeEmpresa])
            .catch(err => { 
                throw new InternalServerError(String(`Erro em ${this.constructor.name}. ${err.message}`)); 
            });
    }

    /**
     * Insere o item na tabela cliente no banco de dados.
     * @param cliente - um objeto do tipo Cliente.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(cliente: Cliente): Promise<any | undefined>
    {
        return await db(TableNames.cliente).insert({
            nome: cliente.nome,
            nome_empresa: cliente.nomeEmpresa,
            tipo_cliente: cliente.tipoCliente,
            idade: cliente.idade,
            negociador: cliente.negociador,
            estado: cliente.estado,
            cidade: cliente.cidade,
            sexo: cliente.sexo,
            id_porte_cliente: cliente.porteCliente!.id
        });
    }

    /**
     * Atualiza o item na tabela cliente no banco de dados.
     * @param cliente - um objeto do tipo Cliente.
     * @returns - uma promise com as informações da atualização.
     */
    async update(cliente: Cliente): Promise<any | undefined>
    {
        return await db(TableNames.cliente)
            .update({
                nome: cliente.nome,
                nome_empresa: cliente.nomeEmpresa,
                tipo_cliente: cliente.tipoCliente,
                idade: cliente.idade,
                negociador: cliente.negociador,
                estado: cliente.estado,
                cidade: cliente.cidade,
                sexo: cliente.sexo,
                id_porte_cliente: cliente.porteCliente!.id
            })
            .where({ id: cliente.id });
    }

    /**
     * Remove o item na tabela cliente no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.cliente)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new ClienteRepository;

