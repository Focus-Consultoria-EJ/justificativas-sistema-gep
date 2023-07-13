import { InternalServerError } from "../../middlewares/Error.middleware";
import { Shark } from "../../models/Shark";
import { TableNames } from "../TableNames";
import db from "../db";

class SharkRepository
{
    /**
     * Traz todos os dados da tabela shark no banco de dados.
     * @param limit - (opcional) limita o número de registros durante a seleção.
     * @param offset - (opcional) indica o início da leitura dos registros. Este item precisa ser usado junto do parâmetro limit.
     * @param membroAtivo - (opcional) especifica se o membro é ativo ou não ao retornar uma consulta.
     * @param nome - (opcional) especifica o nome do sharkno retorno da consulta.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(limit?:number, offset?:number, membroAtivo?:string, nome?:string): Promise<Shark[] | undefined>
    {
        offset = (offset && offset > 0) ? offset : 0;
        limit = (limit && limit > 0) ? limit : 0;
        membroAtivo = (membroAtivo && membroAtivo === "true" || membroAtivo === "false") ? membroAtivo : undefined;

        let query = db(TableNames.shark).where("id", "<>", 1);
        
        if(limit) query = query.limit(limit);
        if(offset) query = query.offset(offset);
        if(membroAtivo) query = query.andWhere("membro_ativo", "=", membroAtivo);
        if(nome) query = query.andWhere("nome", "like", `%${nome}%`);

        return await query.orderBy("id");
    }

    /**
     * Traz uma linha da tabela shark no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Shark | undefined>
    {
        return await db(TableNames.shark)
            .where({ id: id })
            .first();
    }


    /**
     * Verifica se um usuário existe de acordo com um campo.
     * @param col - uma coluna da tabela shark no banco de dados.
     * @param data - o valor da coluna da tabela shark no banco de dados.
     * @returns uma promise do tipo boolean.
     */
    async userExists(col: string, data:string): Promise<boolean>
    {
        if( col === "email" || col === "matricula")
        {
            const result = await db(TableNames.shark)
                .where({ [col]: data })
                .first();
            
            if(!result)
                return false;
            else
                return true;
        }
        else
        {
            const instance = new SharkRepository();
            throw new InternalServerError("Erro na classe: " + instance.constructor.name + " a coluna '" + col + "' não existe.");
        }
    }

    /**
     * Verifica se um usuário existe de acordo com o email.
     * @param email - o e-mail do shark.
     * @returns uma promise contendo um objeto.
     */
    async getByEmail(email:string)
    {
        return await db("shark")
            .where({ email: email })
            .first();
    }
    
    /**
     * Verifica se a coluna e a informação a ser verificada é do usuário identificado pelo id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @param col - uma coluna da tabela shark no banco de dados.
     * @param data - o valor da coluna da tabela shark no banco de dados.
     * @returns uma promise do tipo boolean.
     */
    async verifyIfDataIsFromOwnUser(id: number, col: string, data:string): Promise<boolean>
    {
        if( col === "email" || col === "matricula")
        {
            const result = await db.raw(`SELECT * FROM shark WHERE id = ${id} AND ${col} = '${data}';`)
                .then(result => { return result.rows; }); // ignora os buffers

            // Retorna true se o usuário for dono
            if(result.length)
                return true;
            else
                return false;
        }
        else
        {
            const instance = new SharkRepository();
            throw new InternalServerError("Erro na classe: " + instance.constructor.name + " a coluna '" + col + "' não existe.");
        }
    }

    /**
     * Insere o item na tabela shark no banco de dados.
     * @param shark - um objeto do tipo Shark.
     * @returns uma promise com as informações da inserção.
     */
    async insert(shark: Shark): Promise<any | undefined>
    {
        return await db(TableNames.shark).insert({
            nome: shark.nome,
            email: shark.email,
            telefone: shark.telefone,
            id_distancia_residencia: shark.distancia?.id ?? null,
            matricula: shark.matricula,
            senha: shark.senha,
            id_celula: shark.celula.id,
            num_projeto: shark.numProjeto,
            metragem: shark.metragem,
            admin: shark.admin,
            membro_ativo: shark.membroAtivo,
            data_criacao: shark.dataCriacao
        })
            .returning("id")
            .then(row => { return row[0].id; });
    }

    /**
     * Atualiza o item na tabela shark no banco de dados.
     * @param shark - um objeto do tipo Shark.
     * @returns uma promise com as informações da atualização.
     */
    async update(shark: Shark): Promise<any | undefined>
    {
        let cols;

        if(shark.senha)
        {
            cols = {
                nome: shark.nome,
                email: shark.email,
                telefone: shark.telefone,
                id_distancia_residencia: shark.distancia?.id ?? null,
                matricula: shark.matricula,
                senha: shark.senha,
                id_celula: shark.celula.id,
                num_projeto: shark.numProjeto,
                metragem: shark.metragem,
                admin: shark.admin,
                membro_ativo: shark.membroAtivo
            };
        }
        else
        {
            cols = {
                nome: shark.nome,
                email: shark.email,
                telefone: shark.telefone,
                id_distancia_residencia: shark.distancia?.id ?? null,
                matricula: shark.matricula,
                id_celula: shark.celula.id,
                num_projeto: shark.numProjeto,
                metragem: shark.metragem,
                admin: shark.admin,
                membro_ativo: shark.membroAtivo
            };
        }

        return await db(TableNames.shark)
            .update(cols)
            .where({ id: shark.id })
            .returning("id")
            .then(row => { return row[0].id; });
    }

    /**
     * Remove o item na tabela shark no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.shark)
            .select()
            .where({ id: id })
            .where("id", "<>", 1) // Não permite deletar o usuário base
            .del();
    }

    /**
    * Insere na tabela shark_log no banco de dados.
    * @param idTipoAcaoLog - o identificador relacionado ao tipo de ação. 1 - Inserção, 2 - Atualização, 3 - Remoção.
    * @param id - o identificador da ocorrência que foi inserida. 
    * @param idSharkEditor - o identificador do shark que realizou a edição.
    * @returns uma promise com informações do item inserido.
    */
    async insertSharkLog(idTipoAcaoLog: number, id: number, idSharkEditor: number): Promise<any | undefined>
    {
        return await db(TableNames.shark_log)
            .insert({
                id_tipo_acao_log: idTipoAcaoLog, 
                id_shark: id, 
                id_shark_editor: idSharkEditor});
    }
}

export default new SharkRepository;

