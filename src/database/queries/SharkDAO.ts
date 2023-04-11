import Shark from "../../model/Shark";
import db from "../../config/connection";

class SharkDAO
{
    async select(): Promise<any[] | undefined>
    {
        try
        {
            return await db("shark");
        }
        catch(err: any) { throw err.message; }
    }

    async getById(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("shark")
            .where({ id: id })
            .first();
        }
        catch(err: any) { throw err.message; }
    }

    async selectWithImage(limit?:number, offset?:number): Promise<any[] | undefined>
    {
        offset = (offset && offset > 0) ? offset: 0;
        const strLimitOffset = (limit && limit > 0) ? `LIMIT ${offset},${limit}` : "";

        try
        {
            return await db.raw(`
            SELECT 
                s.id, s.nome, s.email, s.telefone, s.matricula, s.senha, s.area, s.num_projeto, s.metragem, s.admin, s.membro_ativo, s.data_criacao,
                si.id AS "image_id", si.filename AS "image_filename", si.size AS "image_hashname", si.url AS "image_url", si.data_criacao as "image_data_criacao"
            FROM shark s
            LEFT JOIN shark_image si ON (si.id_shark = s.id)
            WHERE s.id <> 1 
            ORDER BY s.id
            ${strLimitOffset};`)
            .then(result => { return result[0]; }); // ignora os buffers
        }
        catch(err: any) { throw err.message; }
    }

    async getByIdWithImage(id: number): Promise<any[] | undefined>
    {
        try
        {
            return await db.raw(`
            SELECT 
                s.id, s.nome, s.email, s.telefone, s.matricula, s.senha, s.area, s.num_projeto, s.metragem, s.admin, s.membro_ativo, s.data_criacao,
                si.id AS "image_id", si.filename AS "image_filename", si.size AS "image_hashname", si.url AS "image_url", si.data_criacao as "image_data_criacao"
            FROM shark s
            LEFT JOIN shark_image si ON (si.id_shark = s.id)
            WHERE s.id <> 1 AND s.id = ${id}`)
            .then(result => { return result[0]; }); // ignora os buffers
        }
        catch(err: any) { throw err.message; }
    }

    // Verifica se um usuário existe de acordo com um campo
    async userExists(data:object): Promise<boolean>
    {
        try
        {
            const result = await db("shark")
            .where(data)
            .first();

            if(!result)
                return false;
            else
                return true;
        }
        catch(err: any) { throw err.message; }
    }
    
    // Verifica se o dado[key]: value, faz parte do mesmo usuário
    async verifyIfDataIsFromOwnUser(id: number, data: Object): Promise<boolean>
    {
        try
        {
            const result = await db.raw(`SELECT * FROM shark WHERE id = ${id} AND ${Object.keys(data)[0]} = '${Object.values(data)[0]}'`)
            .then(result => { return result[0]; }); // ignora os buffers

            // Retorna true se o usuário for dono
            if(result.length)
                return true;
            else
                return false;
        }
        catch(err: any) { throw err.message; }
    }

    async insert(shark: Shark): Promise<any | undefined>
    {
        try
        {
            return await db("shark").insert({
                nome: shark.getNome(),
                email: shark.getEmail(),
                telefone: shark.getTelefone(),
                matricula: shark.getMatricula(),
                senha: shark.getSenha(),
                area: shark.getArea(),
                num_projeto: shark.getNumProjeto(),
                metragem: shark.getMetragem(),
                admin: shark.getAdmin(),
                membro_ativo: shark.getMembroAtivo(),
                data_criacao: shark.getDataCriacao()
            });
        }
        catch(err: any) { throw err.message; }
    }

    async update(shark: Shark): Promise<any | undefined>
    {
        try
        {
            return await db("shark")
            .update({
                nome: shark.getNome(),
                email: shark.getEmail(),
                telefone: shark.getTelefone(),
                matricula: shark.getMatricula(),
                senha: shark.getSenha(),
                area: shark.getArea(),
                num_projeto: shark.getNumProjeto(),
                metragem: shark.getMetragem(),
                admin: shark.getAdmin(),
                membro_ativo: shark.getMembroAtivo()
            })
            .where({ id: shark.getId() });
        }
        catch(err: any) { throw err.message; }
    }

    async delete(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("shark")
            .select()
            .where({ id: id })
            .where("id", "<>", 1)
            .del();
        }
        catch(err: any) { throw err.message; }
    }

    /* id_tipo_acao_log:
    * 1 (Inserção)
    * 2 (Atualização)
    * 3 (Remoção)
    */
    async insertSharkLog(idTipoAcaoLog: number, id: number, idSharkEditor: number): Promise<any | undefined>
    {
        try
        {
            return await db("shark_log")
            .insert({
                id_tipo_acao_log: idTipoAcaoLog, 
                id_shark: id, 
                id_shark_editor: idSharkEditor});
        }
        catch(err: any) { throw err.message; }
    }
}

export default new SharkDAO;