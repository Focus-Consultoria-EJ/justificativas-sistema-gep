import db from "../../config/connection";
import Ocorrencia from "../../model/Ocorrencia";

class OcorrenciaDAO
{
    async select(limit?:number, offset?:number): Promise<Ocorrencia[] | undefined>
    {
        offset = (offset && offset > 0) ? offset: 0;
        const strLimitOffset = (limit && limit > 0) ? `LIMIT ${offset},${limit}` : "";

        return await db.raw(`
        SELECT 
            oc.id, oc.data_ocorrido, toc.id as "id_tipo_de_ocorrencia", toc.nome as "tipo_de_ocorrencia", 
            tas.id as "id_tipo_de_assunto", tas.nome as "tipo_de_assunto", 
            oc.mensagem, oc.valor_metragem, 
            sc.nome as "nome_shark_criador", sc.email as "email_shark_criador", 
            sr.nome as "nome_shark_referente", sr.email as "email_shark_referente", oc.data_criacao  
        FROM ocorrencia oc
        INNER JOIN tipo_ocorrencia toc ON (oc.id_tipo_ocorrencia = toc.id)
        INNER JOIN tipo_assunto tas ON (oc.id_tipo_assunto = tas.id)
        INNER JOIN shark sc ON (oc.id_shark_criador = sc.id)
        INNER JOIN shark sr ON (oc.id_shark_referente = sr.id)
        WHERE sc.membro_ativo <> 0
        ORDER BY oc.id
        ${strLimitOffset};`)
        .then(result => { return result[0]; }); // ignora os buffers
    }      

    async getById(id: number): Promise<Ocorrencia | undefined>
    {
        return await db.raw(`
        SELECT 
            oc.id, oc.data_ocorrido, toc.id as "id_tipo_de_ocorrencia", toc.nome as "tipo_de_ocorrencia", 
            tas.id as "id_tipo_de_assunto", tas.nome as "tipo_de_assunto", 
            oc.mensagem, oc.valor_metragem, 
            sc.nome as "nome_shark_criador", sc.email as "email_shark_criador", 
            sr.nome as "nome_shark_referente", sr.email as "email_shark_referente", oc.data_criacao  
        FROM ocorrencia oc
        INNER JOIN tipo_ocorrencia toc ON (oc.id_tipo_ocorrencia = toc.id)
        INNER JOIN tipo_assunto tas ON (oc.id_tipo_assunto = tas.id)
        INNER JOIN shark sc ON (oc.id_shark_criador = sc.id)
        INNER JOIN shark sr ON (oc.id_shark_referente = sr.id)
        WHERE oc.id = ${id} AND sc.membro_ativo <> 0;
        `) 
        .then(result => { return result[0]; }); // ignora os buffers
    }

    async insert(ocorrencia: Ocorrencia): Promise<any | undefined>
    {
        return await db("ocorrencia").insert({
            data_ocorrido: ocorrencia.getDataOcorrido(),
            id_tipo_ocorrencia: ocorrencia.getTipoOcorrencia().getId(),
            id_tipo_assunto: ocorrencia.getTipoAssunto().getId(),
            mensagem: ocorrencia.getMensagem(),
            valor_metragem: ocorrencia.getValorMetragem(),
            id_shark_criador: ocorrencia.getSharkCriador()?.getId(),
            id_shark_referente: ocorrencia.getSharkReferente()?.getId()
        });
    }

    async update(ocorrencia: Ocorrencia): Promise<any | undefined>
    {
        return await db("ocorrencia")
            .update({
                data_ocorrido: ocorrencia.getDataOcorrido(),
                id_tipo_ocorrencia: ocorrencia.getTipoOcorrencia().getId(),
                id_tipo_assunto: ocorrencia.getTipoAssunto().getId(),
                mensagem: ocorrencia.getMensagem(),
                valor_metragem: ocorrencia.getValorMetragem(),
            })
            .where({ id: ocorrencia.getId() });
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db("ocorrencia")
            .select()
            .where({ id: id })
            .del();
    }

    /* id_tipo_acao_log:
    * 1 (Inserção)
    * 2 (Atualização)
    * 3 (Remoção)
    */
    async insertOcorrenciaLog(idTipoAcaoLog: number, id: number, idSharkEditor: number): Promise<any | undefined>
    {
        return await db("ocorrencia_log")
            .insert({id_tipo_acao_log: idTipoAcaoLog, id_ocorrencia: id, id_shark_editor: idSharkEditor});
    }
}

export default new OcorrenciaDAO;