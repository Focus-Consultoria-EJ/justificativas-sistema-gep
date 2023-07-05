import { InternalServerError } from "../../middlewares/Error.middleware";
import { Shark } from "../../models/Shark";
import { TableNames } from "../TableNames";
import db from "../db";

class SharkRepository
{
    async select(limit?:number, offset?:number, membroAtivo?:string, nome?:string): Promise<any[] | undefined>
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

    async getById(id: number): Promise<Shark | undefined>
    {
        return await db(TableNames.shark)
            .where({ id: id })
            .first();
    }

    // Verifica se um usuário existe de acordo com um campo
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

    // O login pode ser realizado via E-mail ou Matricula
    async getByUsername(login:string)
    {
        return await db("shark")
            .where({ email: login })
            .orWhere({ matricula: login })
            .first();
    }
    
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

    async update(shark: Shark): Promise<any | undefined>
    {
        return await db(TableNames.shark)
            .update({
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
            })
            .where({ id: shark.id })
            .returning("id")
            .then(row => { return row[0].id; });
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.shark)
            .select()
            .where({ id: id })
            .where("id", "<>", 1)
            .del();
    }

    /* id_tipo_acao_log:
    * 1 (Inserção)
    * 2 (Atualização)
    * 3 (Remoção)
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

