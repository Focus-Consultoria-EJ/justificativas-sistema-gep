import { InternalServerError } from "../../../middlewares/Error.middleware";
import { Ocorrencia } from "../../../models/gestaoNotificacao/Ocorrencia";
import { TableNames } from "../../TableNames";
import db from "../../db";

class OcorrenciaRepository
{
    /**
     * Traz todos os dados da tabela ocorrencia no banco de dados.
     * @param size - (opcional) limita o número de registros durante a seleção.
     * @param page - (opcional) indica o início da leitura dos registros. Este item precisa ser usado junto do parâmetro limit.
     * @param membroAtivo - (opcional) especifica se o membro é ativo ou não ao retornar uma consulta.
     * @param nomeSharkCriador (opcional) especifica o nome do shark que criou as ocorrências no retorno da 
     *      consulta.
     * @param nomeSharkReferente (opcional) especifica o nome do shark ao qual as ocorrências foram destinadas
     *      no retorno da consulta.
     * @param emailSharkCriador (opcional) especifica o email do shark que criou as ocorrências no retorno da 
     *      consulta.
     * @param emailSharkReferente (opcional) especifica o email do shark ao qual as ocorrências foram destinadas
     *      no retorno da consulta.
     * @param tipoOcorrencia (opcional) especifica o tipo de ocorrência no retorno da consulta.
     * @param tipoAssunto (opcional) especifica o tipo de assunto no retorno da consulta.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(
        size?:number, page?:number, 
        membroAtivo?:string, nomeSharkCriador?: string,
        nomeSharkReferente?: string, emailSharkCriador?: string,
        emailSharkReferente?: string, tipoOcorrencia?:string, tipoAssunto?:string
    ): Promise<Ocorrencia[] | undefined>
    {
        try
        {
            page = (page && page > 0) ? page : 0;
            size = (size && size > 0) ? size : 0;
            membroAtivo = (membroAtivo && membroAtivo === "true" || membroAtivo === "false") ? membroAtivo : "true";

            let query = db(TableNames.shark)
                .select(
                    "oc.id",
                    "oc.data_ocorrido",
                    "toc.id as id_tipo_ocorrencia",
                    "toc.nome as tipo_ocorrencia",
                    "tas.id as id_tipo_assunto",
                    "tas.nome as tipo_assunto",
                    "oc.mensagem",
                    "oc.valor_metragem",
                    "sc.id as id_shark_criador",
                    "sc.nome as nome_shark_criador",
                    "sc.email as email_shark_criador",
                    "sc.id_celula as id_celula_shark_criador",
                    "scc.nome as nome_celula_shark_criador",
                    "sr.id as id_shark_referente",
                    "sr.nome as nome_shark_referente",
                    "sr.email as email_shark_referente",
                    "sr.id_celula as id_celula_shark_referente",
                    "src.nome as nome_celula_shark_referente",
                    "oc.data_criacao"
                )
                .from(`${TableNames.ocorrencia} as oc`)
                .innerJoin(`${TableNames.tipo_ocorrencia} as toc`, "oc.id_tipo_ocorrencia", "toc.id")
                .innerJoin(`${TableNames.tipo_assunto} as tas`, "oc.id_tipo_assunto", "tas.id")
                .innerJoin(`${TableNames.shark} as sc`, "oc.id_shark_criador", "sc.id")
                .innerJoin(`${TableNames.celula} as scc`, "sc.id_celula", "scc.id")
                .innerJoin(`${TableNames.shark} as sr`, "oc.id_shark_referente", "sr.id")
                .innerJoin(`${TableNames.celula} as src`, "sr.id_celula", "src.id")
                .where("sc.membro_ativo", "=", membroAtivo);
                

            if(nomeSharkCriador) query = query.andWhere("sc.nome", "like", `%${nomeSharkCriador}%`);
            if(nomeSharkReferente) query = query.andWhere("sr.nome", "like", `%${nomeSharkReferente}%`);
            if(emailSharkCriador) query = query.andWhere("sc.email", "like", `%${emailSharkCriador}%`);
            if(emailSharkReferente) query = query.andWhere("sr.email", "like", `%${emailSharkReferente}%`);
            if(tipoOcorrencia) query = query.andWhere("toc.nome", "like", `%${tipoOcorrencia}%`);
            if(tipoAssunto) query = query.andWhere("tas.nome", "like", `%${tipoAssunto}%`);
            if(size) query = query.limit(size);
            if(page) query = query.offset(page);
            
            const data = await query.orderBy("oc.id");
            
            const ocorrencias: Ocorrencia[] = data.map(ocorrencia => ({
                id: ocorrencia.id,
                dataOcorrido: ocorrencia.data_ocorrido,
                tipoOcorrencia: { id: ocorrencia.id_tipo_ocorrencia, nome: ocorrencia.tipo_ocorrencia },
                tipoAssunto: { id: ocorrencia.id_tipo_assunto, nome: ocorrencia.tipo_assunto },
                mensagem: ocorrencia.mensagem,
                valorMetragem: ocorrencia.valor_metragem,
                sharkCriador: { id: ocorrencia.id_shark_criador, nome: ocorrencia.nome_shark_criador, 
                    email: ocorrencia.email_shark_criador, celula: { id: ocorrencia.id_celula_shark_criador, nome: ocorrencia.nome_celula_shark_criador }
                },
                sharkReferente: { id: ocorrencia.id_shark_referente, nome: ocorrencia.nome_shark_referente, 
                    email: ocorrencia.email_shark_referente, celula: { id: ocorrencia.id_celula_shark_referente, nome: ocorrencia.nome_celula_shark_referente } },
                dataCriacao: ocorrencia.data_criacao
            }));
            
            return await ocorrencias;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Traz uma linha da tabela ocorrencia no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Ocorrencia | undefined>
    {
        try
        {
            const data = await db(TableNames.shark)
                .select(
                    "oc.id",
                    "oc.data_ocorrido",
                    "toc.id as id_tipo_ocorrencia",
                    "toc.nome as tipo_ocorrencia",
                    "tas.id as id_tipo_assunto",
                    "tas.nome as tipo_assunto",
                    "oc.mensagem",
                    "oc.valor_metragem",
                    "sc.id as id_shark_criador",
                    "sc.nome as nome_shark_criador",
                    "sc.email as email_shark_criador",
                    "sc.id_celula as id_celula_shark_criador",
                    "scc.nome as nome_celula_shark_criador",
                    "sr.id as id_shark_referente",
                    "sr.nome as nome_shark_referente",
                    "sr.email as email_shark_referente",
                    "sr.id_celula as id_celula_shark_referente",
                    "src.nome as nome_celula_shark_referente",
                    "oc.data_criacao"
                )
                .from(`${TableNames.ocorrencia} as oc`)
                .innerJoin(`${TableNames.tipo_ocorrencia} as toc`, "oc.id_tipo_ocorrencia", "toc.id")
                .innerJoin(`${TableNames.tipo_assunto} as tas`, "oc.id_tipo_assunto", "tas.id")
                .innerJoin(`${TableNames.shark} as sc`, "oc.id_shark_criador", "sc.id")
                .innerJoin(`${TableNames.celula} as scc`, "sc.id_celula", "scc.id")
                .innerJoin(`${TableNames.shark} as sr`, "oc.id_shark_referente", "sr.id")
                .innerJoin(`${TableNames.celula} as src`, "sr.id_celula", "src.id")
                .andWhere("oc.id", "=", id)
                .first();

            if(!data)
                return undefined;

            return {
                id: data.id,
                dataOcorrido: data.data_ocorrido,
                tipoOcorrencia: { id: data.id_tipo_ocorrencia, nome: data.tipo_ocorrencia },
                tipoAssunto: { id: data.id_tipo_assunto, nome: data.tipo_assunto },
                mensagem: data.mensagem,
                valorMetragem: data.valor_metragem,
                sharkCriador: { id: data.id_shark_criador, nome: data.nome_shark_criador, 
                    email: data.email_shark_criador, celula: { id: data.id_celula_shark_criador, nome: data.nome_celula_shark_criador }
                },
                sharkReferente: { id: data.id_shark_referente, nome: data.nome_shark_referente, 
                    email: data.email_shark_referente, celula: { id: data.id_celula_shark_referente, nome: data.nome_celula_shark_referente } },
                dataCriacao: data.data_criacao
            };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Insere o item na tabela ocorrencia no banco de dados.
     * @param ocorrencia - um objeto do tipo Ocorrencia.
     * @returns o id inserido.
     */
    async insert(ocorrencia: Ocorrencia): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia).insert({
            data_ocorrido: ocorrencia.dataOcorrido,
            id_tipo_ocorrencia: ocorrencia.tipoOcorrencia.id,
            id_tipo_assunto: ocorrencia.tipoAssunto.id,
            mensagem: ocorrencia.mensagem,
            valor_metragem: ocorrencia.valorMetragem,
            id_shark_criador: ocorrencia.sharkCriador?.id,
            id_shark_referente: ocorrencia.sharkReferente.id
        })
            .returning("id")
            .then(row => { return row[0].id; });
    }

    /**
     * Atualiza o item na tabela ocorrencia no banco de dados.
     * @param ocorrencia - um objeto do tipo Ocorrencia.
     * @returns - o id atualizado.
     */
    async update(ocorrencia: Ocorrencia): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia)
            .update({
                data_ocorrido: ocorrencia.dataOcorrido,
                id_tipo_ocorrencia: ocorrencia.tipoOcorrencia.id,
                id_tipo_assunto: ocorrencia.tipoAssunto.id,
                mensagem: ocorrencia.mensagem,
                valor_metragem: ocorrencia.valorMetragem
            })
            .where({ id: ocorrencia.id })
            .returning("id")
            .then(row => { return row[0].id; });
    }

    /**
     * Remove o item na tabela ocorrencia no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia)
            .select()
            .where({ id: id })
            .del();
    }

    /**
     * Remote todos os registros do ocorrencia
     * @returns uma promise com informações dos itens removidos.
     */
    async deleteAllOcorrencia(): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia)
            .del()
            .where("id", ">", 0);
    }

    /**
    * Insere na tabela ocorrencia_log no banco de dados.
    * @param idTipoAcaoLog - o identificador relacionado ao tipo de ação. 1 - Inserção, 2 - Atualização, 3 - Remoção.
    * @param id - o identificador da ocorrência que foi inserida. 
    * @param idSharkEditor - o identificador do shark que realizou a edição.
    * @returns uma promise com informações do item inserido.
    */
    async insertOcorrenciaLog(idTipoAcaoLog: number, id: number, idSharkEditor: number): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia_log)
            .insert({
                id_tipo_acao_log: idTipoAcaoLog, 
                id_ocorrencia: id, 
                id_shark_editor: idSharkEditor});
    }

    /**
     * Remote todos os registros do ocorrecia_log
     * @returns uma promise com informações dos itens removidos.
     */
    async deleteAllOcorrenciaLog(): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia_log)
            .del()
            .where("id", ">", 0);
    }
}

export default new OcorrenciaRepository;

