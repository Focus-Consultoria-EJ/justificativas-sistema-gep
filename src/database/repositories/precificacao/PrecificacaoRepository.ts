import db from "../../db";
import { TableNames } from "../../TableNames";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { orderByParameter, pageParameter, sizeParameter } from "../../Parameters";
import { Precificacao } from "../../../models/precificacao/Precificacao";

class PrecificacaoRepository
{
    /**
     * Traz todos os dados da tabela precificacao no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(size?: number, page?: number, order?: string): Promise<Precificacao[] | undefined>
    {
        try
        {
            page = pageParameter(page);
            size = sizeParameter(size);
            order = orderByParameter(order);

            let query = db(TableNames.cliente)
                .select(
                    "p.id",
                    "p.composta",

                    // 1º serviço
                    "s.id as id_servico",
                    "s.nome as nome_servico",

                    // 2º serviço (serviço composto)
                    "sc.id as id_servico_composto",
                    "sc.nome as nome_servico_composto",

                    //cliente
                    "c.id as id_cliente",
                    "c.nome as nome_cliente",
                    "c.nome_empresa as nome_empresa_cliente",
                    "c.tipo_cliente as tipo_cliente",
                    "c.idade as idade_cliente",
                    "c.negociador as negociador_cliente",
                    "c.estado as estado_cliente",
                    "c.cidade as cidade_cliente",
                    "c.sexo as sexo_cliente",
                    // porte cliente
                    "cpc.tipo as tipo_porte_cliente",
                    "cpc.desconto as desconto_porte_cliente",

                    "p.tipo_negocio",
                    "p.margem_incerteza",
                    "p.qtd_membros",
                    "p.custo_variavel",
                    "p.modalidade",

                    // tipo preco
                    "tp.id as id_tipo_preco",
                    "tp.nome as nome_tipo_preco",

                    "p.entrada",
                    "p.parcelado",
                    "p.valor_parcelas",
                    "p.valor_a_vista",
                    "p.data_criacao"
                )
                .from(`${TableNames.precificacao} as p`)
                .innerJoin(`${TableNames.servico} as s`, "p.id_servico", "s.id")
                .leftJoin(`${TableNames.servico} as sc`, "p.id_servico_composto", "sc.id")
                .innerJoin(`${TableNames.cliente} as c`, "p.id_cliente", "c.id")
                .innerJoin(`${TableNames.porte_cliente} as cpc`, "c.id_porte_cliente", "cpc.id")
                .innerJoin(`${TableNames.tipo_preco} as tp`, "p.id_tipo_preco", "tp.id");

            if(size) query = query.limit(size);
            if(page) query = query.offset(page);

            const data = await query.orderBy("p.id", order);

            const precificacoes: Precificacao[] = data.map(data => ({ 
                id: data.id, 
                composta: data.composta,
                servico: { id: data.id_servico, nome: data.nome_servico},
                servicoComposto: { id: data.id_servico_composto, nome: data.nome_servico_composto},
                cliente: { 
                    id: data.id_cliente,
                    nome: data.nome_cliente,
                    nomeEmpresa: data.nome_empresa_cliente,
                    tipoCliente: data.tipo_cliente,
                    idade: data.idade_cliente,
                    negociador: data.negociador_cliente,
                    estado: data.estado_cliente,
                    cidade: data.cidade_cliente,
                    sexo: data.sexo_cliente,
                    porteCliente: { id: data.id_tipo_porte_cliente, tipo: data.tipo_porte_cliente, desconto: data.desconto_porte_cliente }
                },
                tipoNegocio: data.tipo_negocio,
                margemIncerteza: data.margem_incerteza,
                qtdMembros: data.qtd_membros,
                custoVariavel: data.custo_variavel,
                modalidade: data.modalidade,
                tipoPreco: { id: data.id_tipo_preco, nome: data.nome_tipo_preco },
                entrada: data.entrada,
                parcelado: data.parcelado,
                valorParcelas: data.valor_parcelas,
                valorAVista: data.valor_a_vista,
                dataCriacao: data.data_criacao 
            }));

            return precificacoes;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }   

    /**
     * Traz uma linha da tabela precificacao no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Precificacao | undefined>
    {
        try
        {
            const data = await db(TableNames.precificacao)
                .select(
                    "p.id",
                    "p.composta",

                    // 1º serviço
                    "s.id as id_servico",
                    "s.nome as nome_servico",

                    // 2º serviço (serviço composto)
                    "sc.id as id_servico_composto",
                    "sc.nome as nome_servico_composto",

                    //cliente
                    "c.id as id_cliente",
                    "c.nome as nome_cliente",
                    "c.nome_empresa as nome_empresa_cliente",
                    "c.tipo_cliente as tipo_cliente",
                    "c.idade as idade_cliente",
                    "c.negociador as negociador_cliente",
                    "c.estado as estado_cliente",
                    "c.cidade as cidade_cliente",
                    "c.sexo as sexo_cliente",
                    // porte cliente
                    "cpc.tipo as tipo_porte_cliente",
                    "cpc.desconto as desconto_porte_cliente",

                    "p.tipo_negocio",
                    "p.margem_incerteza",
                    "p.qtd_membros",
                    "p.custo_variavel",
                    "p.modalidade",

                    // tipo preco
                    "tp.id as id_tipo_preco",
                    "tp.nome as nome_tipo_preco",

                    "p.entrada",
                    "p.parcelado",
                    "p.valor_parcelas",
                    "p.valor_a_vista",
                    "p.data_criacao"
                )
                .from(`${TableNames.precificacao} as p`)
                .innerJoin(`${TableNames.servico} as s`, "p.id_servico", "s.id")
                .leftJoin(`${TableNames.servico} as sc`, "p.id_servico_composto", "sc.id")
                .innerJoin(`${TableNames.cliente} as c`, "p.id_cliente", "c.id")
                .innerJoin(`${TableNames.porte_cliente} as cpc`, "c.id_porte_cliente", "cpc.id")
                .innerJoin(`${TableNames.tipo_preco} as tp`, "p.id_tipo_preco", "tp.id")
                .andWhere("p.id", "=", id)
                .first();

            if(!data)
                return undefined;

            return { 
                id: data.id, 
                composta: data.composta,
                servico: { id: data.id_servico, nome: data.nome_servico},
                servicoComposto: { id: data.id_servico_composto, nome: data.nome_servico_composto},
                cliente: { 
                    id: data.id_cliente,
                    nome: data.nome_cliente,
                    nomeEmpresa: data.nome_empresa_cliente,
                    tipoCliente: data.tipo_cliente,
                    idade: data.idade_cliente,
                    negociador: data.negociador_cliente,
                    estado: data.estado_cliente,
                    cidade: data.cidade_cliente,
                    sexo: data.sexo_cliente,
                    porteCliente: { id: data.id_tipo_porte_cliente, tipo: data.tipo_porte_cliente, desconto: data.desconto_porte_cliente }
                },
                tipoNegocio: data.tipo_negocio,
                margemIncerteza: data.margem_incerteza,
                qtdMembros: data.qtd_membros,
                custoVariavel: data.custo_variavel,
                modalidade: data.modalidade,
                tipoPreco: { id: data.id_tipo_preco, nome: data.nome_tipo_preco },
                entrada: data.entrada,
                parcelado: data.parcelado,
                valorParcelas: data.valor_parcelas,
                valorAVista: data.valor_a_vista,
                dataCriacao: data.data_criacao 
            };
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }

    /**
     * Insere o item na tabela precificacao no banco de dados.
     * @param cliente - um objeto do tipo Precificacao.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(precificacao: Precificacao): Promise<any | undefined>
    {
        const params: { [key: string]: any } = {
            composta: precificacao.composta,
            id_servico: precificacao.servico?.id,
            id_cliente: precificacao.cliente?.id,
            id_servico_composto: null,
            tipo_negocio: precificacao.tipoNegocio,
            margem_incerteza: precificacao.margemIncerteza,
            qtd_membros: precificacao.qtdMembros,
            custo_variavel: precificacao.custoVariavel,
            modalidade: precificacao.modalidade,
            id_tipo_preco: precificacao.tipoPreco?.id,
            entrada: precificacao.entrada,
            parcelado: precificacao.parcelado,
            valor_parcelas: precificacao.valorParcelas,
            valor_a_vista: precificacao.valorAVista
        };

        // Se true, adiciona um novo atributo, no caso o serviço composto
        if(precificacao.composta)
            params.id_servico_composto = precificacao.servicoComposto?.id;

        return await db(TableNames.precificacao).insert(params);
    }

    /**
     * Atualiza o item na tabela precificacao no banco de dados.
     * @param precificacao - um objeto do tipo Precificacao.
     * @returns - uma promise com as informações da atualização.
     */
    async update(precificacao: Precificacao): Promise<any | undefined>
    {
        const params: { [key: string]: any } = {
            composta: precificacao.composta,
            id_servico: precificacao.servico?.id,
            id_servico_composto: null,
            id_cliente: precificacao.cliente?.id,
            tipo_negocio: precificacao.tipoNegocio,
            margem_incerteza: precificacao.margemIncerteza,
            qtd_membros: precificacao.qtdMembros,
            custo_variavel: precificacao.custoVariavel,
            modalidade: precificacao.modalidade,
            id_tipo_preco: precificacao.tipoPreco?.id,
            entrada: precificacao.entrada,
            parcelado: precificacao.parcelado,
            valor_parcelas: precificacao.valorParcelas,
            valor_a_vista: precificacao.valorAVista
        };

        // Se true, adiciona um novo atributo, no caso o serviço composto
        if(precificacao.composta)
            params.id_servico_composto = precificacao.servicoComposto?.id;

        return await db(TableNames.precificacao)
            .update(params)
            .where({ id: precificacao.id });
    }

    /**
     * Remove o item na tabela precificacao no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.precificacao)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new PrecificacaoRepository;

