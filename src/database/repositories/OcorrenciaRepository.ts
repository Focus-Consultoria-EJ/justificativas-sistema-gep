import { Ocorrencia } from "../../models/Ocorrencia";
import { TableNames } from "../TableNames";
import db from "../db";

class OcorrenciaRepository
{
    /**
     * Traz todos os dados da tabela ocorrencia no banco de dados.
     * @param limit - (opcional) limita o número de registros durante a seleção.
     * @param offset - (opcional) indica o início da leitura dos registros. Este item precisa ser usado junto do parâmetro limit.
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
        limit?:number, offset?:number, 
        membroAtivo?:string, nomeSharkCriador?: string,
        nomeSharkReferente?: string, emailSharkCriador?: string,
        emailSharkReferente?: string, tipoOcorrencia?:string, tipoAssunto?:string
    ): Promise<Ocorrencia[] | undefined>
    {
        offset = (offset && offset > 0) ? offset : 0;
        limit = (limit && limit > 0) ? limit : 0;
        membroAtivo = (membroAtivo && membroAtivo === "true" || membroAtivo === "false") ? membroAtivo : "true";

        let query = db(TableNames.shark)
            .select(
                "oc.id",
                "oc.data_ocorrido",
                "toc.id as id_tipo_de_ocorrencia",
                "toc.nome as tipo_de_ocorrencia",
                "tas.id as id_tipo_de_assunto",
                "tas.nome as tipo_de_assunto",
                "oc.mensagem",
                "oc.valor_metragem",
                "sc.id as id_shark_criador",
                "sc.nome as nome_shark_criador",
                "sc.email as email_shark_criador",
                "sr.id as id_shark_referente",
                "sr.nome as nome_shark_referente",
                "sr.email as email_shark_referente",
                "oc.data_criacao"
            )
            .from(`${TableNames.ocorrencia} as oc`)
            .innerJoin(`${TableNames.tipo_ocorrencia} as toc`, "oc.id_tipo_ocorrencia", "toc.id")
            .innerJoin(`${TableNames.tipo_assunto} as tas`, "oc.id_tipo_assunto", "tas.id")
            .innerJoin(`${TableNames.shark} as sc`, "oc.id_shark_criador", "sc.id")
            .innerJoin(`${TableNames.shark} as sr`, "oc.id_shark_referente", "sr.id")
            .where("sc.membro_ativo", "=", membroAtivo)
            .orderBy("oc.id");

        if(nomeSharkCriador) query = query.andWhere("sc.nome", "like", `%${nomeSharkCriador}%`);
        if(nomeSharkReferente) query = query.andWhere("sr.nome", "like", `%${nomeSharkReferente}%`);
        if(emailSharkCriador) query = query.andWhere("sc.email", "like", `%${emailSharkCriador}%`);
        if(emailSharkReferente) query = query.andWhere("sr.email", "like", `%${emailSharkReferente}%`);
        if(tipoOcorrencia) query = query.andWhere("toc.nome", "like", `%${tipoOcorrencia}%`);
        if(tipoAssunto) query = query.andWhere("tas.nome", "like", `%${tipoAssunto}%`);
        if(limit) query = query.limit(limit);
        if(offset) query = query.offset(offset);

        return await query;
    }

    /**
     * Traz uma linha da tabela ocorrencia no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Ocorrencia | undefined>
    {
        return await db(TableNames.shark)
            .select(
                "oc.id",
                "oc.data_ocorrido",
                "toc.id as id_tipo_de_ocorrencia",
                "toc.nome as tipo_de_ocorrencia",
                "tas.id as id_tipo_de_assunto",
                "tas.nome as tipo_de_assunto",
                "oc.mensagem",
                "oc.valor_metragem",
                "sc.id as id_shark_criador",
                "sc.nome as nome_shark_criador",
                "sc.email as email_shark_criador",
                "sr.id as id_shark_referente",
                "sr.nome as nome_shark_referente",
                "sr.email as email_shark_referente",
                "oc.data_criacao"
            )
            .from(`${TableNames.ocorrencia} as oc`)
            .innerJoin(`${TableNames.tipo_ocorrencia} as toc`, "oc.id_tipo_ocorrencia", "toc.id")
            .innerJoin(`${TableNames.tipo_assunto} as tas`, "oc.id_tipo_assunto", "tas.id")
            .innerJoin(`${TableNames.shark} as sc`, "oc.id_shark_criador", "sc.id")
            .innerJoin(`${TableNames.shark} as sr`, "oc.id_shark_referente", "sr.id")
            .andWhere("oc.id", "=", id)
            .first();
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
            id_shark_criador: ocorrencia.sharkCriador.id,
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
            .where({ id:ocorrencia.id })
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
}

export default new OcorrenciaRepository;

