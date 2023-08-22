import { InternalServerError } from "../../../middlewares/Error.middleware";
import { LogOcorrencia, Ocorrencia } from "../../../models/gestaoNotificacao/Ocorrencia";
import { TableNames } from "../../TableNames";
import db from "../../db";
import { membroAtivoParameter, orderByParameter, pageParameter, sizeParameter } from "../../Parameters";

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
        size?: number, page?: number, 
        membroAtivo?: string, nomeSharkCriador?: string,
        nomeSharkReferente?: string, emailSharkCriador?: string,
        emailSharkReferente?: string, tipoOcorrencia?: string, tipoAssunto?: string,
        order?: string
    ): Promise<Ocorrencia[] | undefined>
    {
        try
        {
            page = pageParameter(page);
            size = sizeParameter(size);
            membroAtivo = membroAtivoParameter(membroAtivo, "true");
            order = orderByParameter(order, "DESC");

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
                    "nvg.id as id_nivel_gratificacao",
                    "nvg.nome as nome_nivel_gratificacao",
                    "nvg.valor as valor_nivel_gratificacao",
                    "nva.id as id_nivel_advertencia",
                    "nva.nome as nome_nivel_advertencia",
                    "nva.valor as valor_nivel_advertencia",
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
                .leftJoin(`${TableNames.nivel_gratificacao} as nvg`, "oc.id_nivel_gratificacao", "nvg.id")
                .leftJoin(`${TableNames.nivel_advertencia} as nva`, "oc.id_nivel_advertencia", "nva.id")
                .where("sc.membro_ativo", "=", membroAtivo!);

            if(nomeSharkCriador) query = query.andWhere("sc.nome", "ilike", `%${nomeSharkCriador}%`);
            if(nomeSharkReferente) query = query.andWhere("sr.nome", "ilike", `%${nomeSharkReferente}%`);
            if(emailSharkCriador) query = query.andWhere("sc.email", "ilike", `%${emailSharkCriador}%`);
            if(emailSharkReferente) query = query.andWhere("sr.email", "ilike", `%${emailSharkReferente}%`);
            if(tipoOcorrencia) query = query.andWhere("toc.nome", "ilike", `%${tipoOcorrencia}%`);
            if(tipoAssunto) query = query.andWhere("tas.nome", "ilike", `%${tipoAssunto}%`);
                
            if(size) query = query.limit(size);
            if(page) query = query.offset(page);
            
            const data = await query.orderBy("oc.id", order);
            
            const ocorrencias: Ocorrencia[] = data.map(ocorrencia => {
                const ocorrenciaEditada = {
                    id: ocorrencia.id,
                    dataOcorrido: ocorrencia.data_ocorrido,
                    tipoOcorrencia: { id: ocorrencia.id_tipo_ocorrencia, nome: ocorrencia.tipo_ocorrencia },
                    tipoAssunto: { id: ocorrencia.id_tipo_assunto, nome: ocorrencia.tipo_assunto },
                    mensagem: ocorrencia.mensagem,
                    valorMetragem: ocorrencia.valor_metragem,
                    nivelGratificacao: { id: ocorrencia.id_nivel_gratificacao, nome: ocorrencia.nome_nivel_gratificacao, valor: ocorrencia.valor_nivel_gratificacao},
                    nivelAdvertencia: { id: ocorrencia.id_nivel_advertencia, nome: ocorrencia.nome_nivel_advertencia, valor: ocorrencia.valor_nivel_advertencia},
                    sharkCriador: { id: ocorrencia.id_shark_criador, nome: ocorrencia.nome_shark_criador, 
                        email: ocorrencia.email_shark_criador, celula: { id: ocorrencia.id_celula_shark_criador, nome: ocorrencia.nome_celula_shark_criador }
                    },
                    sharkReferente: { id: ocorrencia.id_shark_referente, nome: ocorrencia.nome_shark_referente, 
                        email: ocorrencia.email_shark_referente, celula: { id: ocorrencia.id_celula_shark_referente, nome: ocorrencia.nome_celula_shark_referente } },
                    dataCriacao: ocorrencia.data_criacao
                } as Ocorrencia;

                // Remove o item da ocorrência caso o id seja null
                if(ocorrenciaEditada.nivelGratificacao?.id === null)
                    delete ocorrenciaEditada.nivelGratificacao;

                if(ocorrenciaEditada.nivelAdvertencia?.id === null)
                    delete ocorrenciaEditada.nivelAdvertencia;

                return ocorrenciaEditada;
            });
            
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
                    "nvg.id as id_nivel_gratificacao",
                    "nvg.nome as nome_nivel_gratificacao",
                    "nvg.valor as valor_nivel_gratificacao",
                    "nva.id as id_nivel_advertencia",
                    "nva.nome as nome_nivel_advertencia",
                    "nva.valor as valor_nivel_advertencia",
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
                .leftJoin(`${TableNames.nivel_gratificacao} as nvg`, "oc.id_nivel_gratificacao", "nvg.id")
                .leftJoin(`${TableNames.nivel_advertencia} as nva`, "oc.id_nivel_advertencia", "nva.id")
                .andWhere("oc.id", "=", id)
                .first();

            if(!data)
                return undefined;

            const ocorrrencia = {
                id: data.id,
                dataOcorrido: data.data_ocorrido,
                tipoOcorrencia: { id: data.id_tipo_ocorrencia, nome: data.tipo_ocorrencia },
                tipoAssunto: { id: data.id_tipo_assunto, nome: data.tipo_assunto },
                mensagem: data.mensagem,
                valorMetragem: data.valor_metragem,
                nivelGratificacao: { id: data.id_nivel_gratificacao, nome: data.nome_nivel_gratificacao, valor: data.valor_nivel_gratificacao},
                nivelAdvertencia: { id: data.id_nivel_advertencia, nome: data.nome_nivel_advertencia, valor: data.valor_nivel_advertencia},
                sharkCriador: { id: data.id_shark_criador, nome: data.nome_shark_criador, 
                    email: data.email_shark_criador, celula: { id: data.id_celula_shark_criador, nome: data.nome_celula_shark_criador }
                },
                sharkReferente: { id: data.id_shark_referente, nome: data.nome_shark_referente, 
                    email: data.email_shark_referente, celula: { id: data.id_celula_shark_referente, nome: data.nome_celula_shark_referente } },
                dataCriacao: data.data_criacao
            } as Ocorrencia;

            // Remove o item da ocorrência caso o id seja null
            if(ocorrrencia.nivelGratificacao?.id === null)
                delete ocorrrencia.nivelGratificacao;

            if(ocorrrencia.nivelAdvertencia?.id === null )
                delete ocorrrencia.nivelAdvertencia;

            return ocorrrencia;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Verifica se já existe uma ocorrência do tipo aviso, associado a um determinado
     * shark e também de um tipo de assunto repetido dentro do período de 6 meses.
     * @param ocorrencia - a ocorrência a ser verificada.
     * @returns true se for uma ocorrência que já existe
     */
    async getAvisoRepetido(ocorrencia: Ocorrencia): Promise<boolean>
    {
        try
        {
            const result = await db(TableNames.ocorrencia)
                .where("id_tipo_ocorrencia", "=", ocorrencia.tipoOcorrencia.id!)
                .andWhere("id_tipo_assunto", "=", ocorrencia.tipoAssunto.id!)
                .andWhere("id_shark_referente", "=", ocorrencia.sharkReferente.id!)
                .andWhere("data_criacao", ">=", db.raw("NOW() - INTERVAL '6 months' "));
        
            if(result.length)
                return true;
            else
                return false;
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
            id_nivel_gratificacao: ocorrencia.nivelGratificacao?.id,
            id_nivel_advertencia: ocorrencia.nivelAdvertencia?.id,
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

    
    /* SEÇÃO DO LOG DE OCORRÊNCIAS */

    /**
     * Traz todos os logs das ações realizadas na tabela ocorrencia no banco de dados.
     * @param size - (opcional) limita o número de registros durante a seleção.
     * @param page - (opcional) indica o início da leitura dos registros. Este item precisa ser usado junto do parâmetro limit.
     * @param order - (opcional) especifica se a ordenação é crescente ou decrescente.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async selectOcorrenciaLog(size?:number, page?:number, order?: string): Promise<LogOcorrencia[] | undefined>
    {
        size = sizeParameter(size);
        page = pageParameter(page);
        order = orderByParameter(order, "DESC");

        let query = db(TableNames.ocorrencia_log)
            .select(
                "ol.id",
                "tal.id as id_tipo_acao_log",
                "tal.nome as tipo_acao",
                "o.id as id_ocorrencia",
                "o.id_shark_criador",
                "osc.nome as nome_shark_criador",
                "osc.email as email_shark_criador",
                "se.id as id_shark_editor",
                "se.nome as nome_shark_editor",
                "se.email as email_shark_editor",
                "ol.data_acao"
            )
            .from(`${TableNames.ocorrencia_log} as ol`)
            .innerJoin(`${TableNames.tipo_acao_log} as tal`, "tal.id", "ol.id_tipo_acao_log")
            .innerJoin(`${TableNames.shark} as se`, "se.id", "ol.id_shark_editor")
            .leftJoin(`${TableNames.ocorrencia} as o`, "o.id", "ol.id_ocorrencia")
            .innerJoin(`${TableNames.shark} as osc`, "o.id_shark_criador", "osc.id");

        if(size) query = query.limit(size);
        if(page) query = query.offset(page);

        const data = await query.orderBy("ol.id", order);

        const LogOcorrencias: LogOcorrencia[] = data.map(data => {
            return {
                id: data.id,
                tipoAcaoLog: { id: data.id_tipo_acao_log, nome: data.tipo_acao },
                ocorrencia: { 
                    id: data.id, 
                    sharkCriador: { id: data.id_shark_criador, nome: data.nome_shark_criador, email: data.email_shark_criador }  
                },
                sharkEditor: { 
                    id: data.id_shark_editor, 
                    nome: data.nome_shark_editor, 
                    email: data.email_shark_editor 
                },
                dataAcao: data.data_acao
            } as LogOcorrencia;
        });
            
        return LogOcorrencias;
    }

    /**
     * Traz todos os logs das ações realizadas na tabela ocorrencia de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getByIdOcorrenciaLog(id: number): Promise<LogOcorrencia | undefined>
    {
        const data = await db(TableNames.ocorrencia_log)
            .select(
                "ol.id",
                "tal.id as id_tipo_acao_log",
                "tal.nome as tipo_acao",
                "o.id as id_ocorrencia",
                "o.id_shark_criador",
                "osc.nome as nome_shark_criador",
                "osc.email as email_shark_criador",
                "se.id as id_shark_editor",
                "se.nome as nome_shark_editor",
                "se.email as email_shark_editor",
                "ol.data_acao"
            )
            .from(`${TableNames.ocorrencia_log} as ol`)
            .innerJoin(`${TableNames.tipo_acao_log} as tal`, "tal.id", "ol.id_tipo_acao_log")
            .innerJoin(`${TableNames.shark} as se`, "se.id", "ol.id_shark_editor")
            .leftJoin(`${TableNames.ocorrencia} as o`, "o.id", "ol.id_ocorrencia")
            .innerJoin(`${TableNames.shark} as osc`, "o.id_shark_criador", "osc.id")
            .andWhere("ol.id", "=", id)
            .first();

        if(!data)
            return undefined;
        
        return {
            id: data.id,
            tipoAcaoLog: { id: data.id_tipo_acao_log, nome: data.tipo_acao },
            ocorrencia: { 
                id: data.id, 
                sharkCriador: { id: data.id_shark_criador, nome: data.nome_shark_criador, email: data.email_shark_criador }  
            },
            sharkEditor: { id: data.id_shark_editor, nome: data.nome_shark_editor, email: data.email_shark_editor },
            dataAcao: data.data_acao
        } as LogOcorrencia;
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

