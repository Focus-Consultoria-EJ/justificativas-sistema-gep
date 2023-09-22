import db from "../../db";
import { TableNames } from "../../TableNames";
import { InternalServerError } from "../../../middlewares/Error.middleware";
import { Custo } from "../../../models/precificacao/Custo";

// TESTAR ESTE REPOSITORY
class CustoRepository
{
    /**
     * Traz todos os dados da tabela total_custo incluida a tabela custo no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<Custo[] | undefined>
    {
        try
        {
            const data = await db(TableNames.custo)
                .select(
                    "c.id",
                    "c.nome",
                    "c.mes_inicio",
                    "c.quantidade",
                    "c.preco",
                    "c.numero_dias",
                    "tc.id as id_total_custo",
                    "tc.resultado",
                    "tc.valido",
                    "tc.justificativa",
                    "tc.data_criacao"
                )
                .from(`${TableNames.total_custo} as tc`)
                .leftJoin(`${TableNames.custo} as c`, "c.id_total_custo", "tc.id")
                .orderBy("id");

            const custos: Custo[] = data.map(data => ({
                id: data.id, 
                nome: data.nome,
                mesInicio: data.mes_inicio,
                quantidade: data.quantidade,
                preco: data.preco,
                numeroDias: data.numero_dias,
                totalCusto: { id: data.id_total_custo, resultado: data.resultado, valido: data.valido, justificativa: data.justificativa, dataCriacao: data.data_criacao }
            }));

            return custos;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }   

    /**
     * Traz uma linha da tabela total_custo incluida a tabela custo no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Custo[] | undefined>
    {
        try
        {
            const data = await db(TableNames.custo)
                .select(
                    "c.id",
                    "c.nome",
                    "c.mes_inicio",
                    "c.quantidade",
                    "c.preco",
                    "c.numero_dias",
                    "tc.id as id_total_custo",
                    "tc.resultado",
                    "tc.valido",
                    "tc.justificativa",
                    "tc.data_criacao"
                )
                .from(`${TableNames.total_custo} as tc`)
                .leftJoin(`${TableNames.custo} as c`, "c.id_total_custo", "tc.id")
                .where({ id_total_custo: id });

            if(!data || data.length === 0)
                return undefined;

            const custos: Custo[] = data.map(data => ({
                id: data.id, 
                nome: data.nome,
                mesInicio: data.mes_inicio,
                quantidade: data.quantidade,
                preco: data.preco,
                numeroDias: data.numero_dias,
                valido: data.valido,
                justificativa: data.justificativa,
                totalCusto: { id: data.id_total_custo, resultado: data.resultado, valido: data.valido, justificativa: data.justificativa, dataCriacao: data.data_criacao }
            }));

            return custos;
        }
        catch (err) { throw new InternalServerError(String(`Erro em ${this.constructor.name}: ${err}`)); }
    }

    /**
     * Insere o item na tabela custo e total_custo no banco de dados.
     * @param custo - um objeto do tipo Custo.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(custos: Custo[]): Promise<any | undefined>
    {
        try
        {
            return await db.transaction(async (trx) => {

                // Calcula o somatório total do atributo "preco"
                const somatorioPrecos = custos.reduce((total, custo) => total + (custo.preco || 0), 0);
                
                return await trx(TableNames.total_custo).insert({
                    resultado: somatorioPrecos,
                    valido: null, 
                    justificativa: null,
                })
                    .returning("id")
                    .then(row => { return row[0].id; })
                    .then(async (idTotalCusto) => {

                        // insere todos os custos na tabela custo 
                        custos.forEach(async (custo) => {
                            return await trx(TableNames.custo).insert({ 
                                nome: custo.nome,
                                mes_inicio: custo.mesInicio,
                                quantidade: custo.quantidade,
                                preco: custo.preco,
                                numero_dias: custo.numeroDias,
                                id_total_custo: idTotalCusto
                            });
                        });
                    });
            });
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Atualiza o item na tabela custo no banco de dados.
     * @param totalCusto - um objeto do tipo TotalCusto.
     * @returns - uma promise com as informações da atualização.
     */
    async update(custos: Custo[], idTotalCusto: number): Promise<any | undefined>
    {
        try 
        {
            return await db.transaction(async (trx) => {
                const somatorioPrecos = custos.reduce((total, custo) => total + (custo.preco || 0), 0);
    
                await trx(TableNames.total_custo)
                    .where({ id: idTotalCusto })
                    .update({
                        resultado: somatorioPrecos,
                        valido: custos[0].totalCusto?.valido, 
                        justificativa: custos[0].totalCusto?.justificativa,
                    });
    
                const atualizacoesCusto = custos.map(async (custo) => {
                    await trx(TableNames.custo)
                        .where({ id: custo.id }) // Substitua pelo critério correto para atualizar o custo
                        .update({ 
                            nome: custo.nome,
                            mes_inicio: custo.mesInicio,
                            quantidade: custo.quantidade,
                            preco: custo.preco,
                            numero_dias: custo.numeroDias,
                            id_total_custo: idTotalCusto
                        });
                });
    
                await Promise.all(atualizacoesCusto);
            });
        } catch (err) { throw new InternalServerError(String(err)); }
            
        
    }

    /**
     * Remove os itens na tabela custo na tabela total_custo de acordo com o id total_custo no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(idTotalCusto: number): Promise<any | undefined>
    {
        try 
        {
            return await db.transaction(async (trx) => {
    
                await trx(TableNames.custo)
                    .select()
                    .where({ id_total_custo: idTotalCusto })
                    .del()
                    .then(async () => {
                        await trx(TableNames.total_custo)
                            .select()
                            .where({ id: idTotalCusto })
                            .del();
                    });
            });
        } catch (err) { throw new InternalServerError(String(err)); }
    }
}

export default new CustoRepository;

