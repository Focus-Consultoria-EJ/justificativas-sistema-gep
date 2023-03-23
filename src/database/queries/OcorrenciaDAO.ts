import db from "../../config/connection";
import Ocorrencia from "../../model/Ocorrencia";

class OcorrenciaDAO
{
    async select(): Promise<Ocorrencia[] | undefined>
    {
        return await db.raw(`
        SELECT 
            oc.id, oc.data_ocorrido, toc.id as "id_tipo_de_ocorrencia", toc.nome as "tipo_de_ocorrencia", 
            tas.id as "id_tipo_de_assunto", tas.nome as "tipo_de_assunto", 
            oc.mensagem, oc.valor_metragem, 
            s.nome as "nome_shark", s.email, oc.data_criacao  
        FROM ocorrencia oc
        INNER JOIN tipo_ocorrencia toc ON (oc.id_tipo_ocorrencia = toc.id)
        INNER JOIN tipo_assunto tas ON (oc.id_tipo_assunto = tas.id)
        INNER JOIN shark s ON (oc.id_shark = s.id)
        WHERE s.membro_ativo <> 0;
        `)
        .then(result => { return result[0]; }); // ignora os buffers
    }      

    async getById(id: number): Promise<Ocorrencia | undefined>
    {
        return await db.raw(`
        SELECT 
            oc.id, oc.data_ocorrido, toc.id as "id_tipo_de_ocorrencia", toc.nome as "tipo_de_ocorrencia", 
            tas.id as "id_tipo_de_assunto", tas.nome as "tipo_de_assunto", 
            oc.mensagem, oc.valor_metragem, 
            s.nome as "nome_shark", s.email, oc.data_criacao  
        FROM ocorrencia oc
        INNER JOIN tipo_ocorrencia toc ON (oc.id_tipo_ocorrencia = toc.id)
        INNER JOIN tipo_assunto tas ON (oc.id_tipo_assunto = tas.id)
        INNER JOIN shark s ON (oc.id_shark = s.id)
        WHERE oc.id = ${id} AND s.membro_ativo <> 0;
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
            id_shark: ocorrencia.getShark()?.getId()
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
                valor_metragem: ocorrencia.getValorMetragem()
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