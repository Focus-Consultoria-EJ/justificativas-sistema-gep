import { Ocorrencia } from "../../models/Ocorrencia";
import { TableNames } from "../TableNames";
import db from "../db";

class OcorrenciaRepository
{
    async select(
        limit?:number, offset?:number, 
        membroAtivo?:string, nomeSharkCriador?: string,
        nomeSharkReferente?: string, emailSharkCriador?: string,
        emailSharkReferente?: string, tipoOcorrencia?:string, tipoAssunto?:string
    ): Promise<any[] | undefined>
    {
        offset = (offset && offset > 0) ? offset : 0;
        limit = (limit && limit > 0) ? limit : 0;
        membroAtivo = (membroAtivo && membroAtivo === "true" || membroAtivo === "false") ? membroAtivo : "true";

        console.log(nomeSharkReferente);

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

    async getById(id: number): Promise<any | undefined>
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

    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.ocorrencia)
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
        return await db(TableNames.ocorrencia_log)
            .insert({
                id_tipo_acao_log: idTipoAcaoLog, 
                id_ocorrencia: id, 
                id_shark_editor: idSharkEditor});
    }
}

export default new OcorrenciaRepository;

