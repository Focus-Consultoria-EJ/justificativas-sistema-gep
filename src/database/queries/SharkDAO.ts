import Shark from "../../model/Shark";
import db from "../../config/connection";
import SharkImage from "../../model/SharkImage";

class SharkDAO
{
    async select(): Promise<Shark[] | undefined>
    {
        return await db("shark");
    }

    async getById(id: number): Promise<Shark | undefined>
    {
        return await db("shark")
            .where({ id: id })
            .first();
    }

    async selectWithImage(limit?:number, offset?:number): Promise<Shark[] | undefined>
    {
        offset = (offset && offset > 0) ? offset: 0;
        const strLimitOffset = (limit && limit > 0) ? `LIMIT ${offset},${limit}` : "";

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

    async getByIdWithImage(id: number): Promise<Shark[] | undefined>
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

    // Verifica se um usuário existe de acordo com um campo
    async userExists(data:object): Promise<boolean>
    {
        const result = await db("shark")
            .where(data)
            .first();

        if(!result)
            return false;
        else
            return true;
    }
    
    // Verifica se o dado[key]: value, faz parte do mesmo usuário
    async verifyIfDataIsFromOwnUser(id: number, data: Object): Promise<boolean>
    {
        const result = await db.raw(`SELECT * FROM shark WHERE id = ${id} AND ${Object.keys(data)[0]} = '${Object.values(data)[0]}'`)
            .then(result => { return result[0]; }); // ignora os buffers

        // Retorna true se o usuário for dono
        if(result.length)
            return true;
        else
            return false;
    }

    async insert(shark: Shark): Promise<any | undefined>
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

    async update(shark: Shark): Promise<any | undefined>
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

    async delete(id: number): Promise<any | undefined>
    {
        return await db("shark")
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
        return await db("shark_log")
            .insert({
                id_tipo_acao_log: idTipoAcaoLog, 
                id_shark: id, 
                id_shark_editor: idSharkEditor})
    }
}

export default new SharkDAO;