import { BadRequestError, InternalServerError } from "../../middlewares/Error.middleware";
import { EmailPessoal } from "../../models/EmailPessoal";
import { Shark } from "../../models/Shark";
import { TableNames } from "../TableNames";
import db from "../db";

class SharkRepository
{
    /**
     * Traz todos os dados da tabela shark no banco de dados.
     * @param size - (opcional) limita o número de registros durante a seleção.
     * @param page - (opcional) indica o início da leitura dos registros. Este item precisa ser usado junto do parâmetro limit.
     * @param membroAtivo - (opcional) especifica se o membro é ativo ou não ao retornar uma consulta.
     * @param nome - (opcional) especifica o nome do sharkno retorno da consulta.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(size?:number, page?:number, membroAtivo?:string, nome?:string): Promise<Shark[] | undefined>
    {
        try
        {
            page = (page && page > 0) ? page : 0;
            size = (size && size > 0) ? size : 0;
            membroAtivo = (membroAtivo && membroAtivo === "true" || membroAtivo === "false") ? membroAtivo : undefined;

            let query = db(TableNames.shark).select(
                "s.id",
                "s.nome",
                "s.email",
                "ep.email as email_pessoal",
                "s.telefone",
                "s.cpf",
                "s.id_distancia_residencia",
                "dr.distancia",
                "s.matricula",
                "s.senha",
                "s.id_celula",
                "c.nome as nome_celula",
                "s.num_projeto",
                "s.metragem",
                "s.id_celula",
                "s.id_role",
                "r.nome as nome_role",
                "s.membro_ativo",
                "s.data_criacao"
            )
                .from(`${TableNames.shark} as s`)
                .innerJoin(`${TableNames.distancia_residencia} as dr`, "s.id_distancia_residencia", "dr.id")
                .innerJoin(`${TableNames.celula} as c`, "s.id_celula", "c.id")
                .innerJoin(`${TableNames.role} as r`, "s.id_role", "r.id")
                .leftJoin(`${TableNames.email_pessoal} as ep`, "ep.id_shark", "s.id");
            
            // params
            if(size) query = query.limit(size);
            if(page) query = query.offset(page);
            if(membroAtivo) query = query.andWhere("membro_ativo", "=", membroAtivo);
            if(nome) query = query.andWhere("nome", "like", `%${nome}%`);
            query = query.where("s.id", "<>", 1);

            const data = await query.orderBy("s.id");

            const sharks: Shark[] = data.map(shark => ({
                id: shark.id,
                nome: shark.nome,
                email: shark.email,
                emailPessoal: shark.email_pessoal,
                telefone: shark.telefone,
                cpf: shark.cpf,
                distancia: { id: shark.id_distancia_residencia, distancia: shark.distancia },
                matricula: shark.matricula,
                senha: shark.senha,
                celula: { id: shark.id_celula, nome: shark.nome_celula },
                numProjeto: shark.num_projeto,
                metragem: shark.metragem,
                role: { id: shark.id_role, nome: shark.nome_role },
                membroAtivo: shark.membro_ativo,
                dataCriacao: shark.data_criacao
            }));

            
            
            return sharks;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Traz uma linha da tabela shark no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<Shark | undefined>
    {
        try
        {
            let query = db(TableNames.shark).select(
                "s.id",
                "s.nome",
                "s.email",
                "ep.email as email_pessoal",
                "s.telefone",
                "s.cpf",
                "s.id_distancia_residencia",
                "dr.distancia",
                "s.matricula",
                "s.senha",
                "s.id_celula",
                "c.nome as nome_celula",
                "s.num_projeto",
                "s.metragem",
                "s.id_role",
                "s.id_celula",
                "r.nome as nome_role",
                "s.membro_ativo",
                "s.data_criacao"
            )
                .from(`${TableNames.shark} as s`)
                .innerJoin(`${TableNames.distancia_residencia} as dr`, "s.id_distancia_residencia", "dr.id")
                .innerJoin(`${TableNames.celula} as c`, "s.id_celula", "c.id")
                .innerJoin(`${TableNames.role} as r`, "s.id_role", "r.id")
                .leftJoin(`${TableNames.email_pessoal} as ep`, "ep.id_shark", "s.id");
                
            // params
            query = query.where("s.id", "=", id);
    
            const data =  await query.first();
    
            if(!data)
                return undefined;

            return {
                id: data.id,
                nome: data.nome,
                email: data.email,
                emailPessoal: data.email_pessoal,
                telefone: data.telefone,
                cpf: data.cpf,
                distancia: { id: data.id_distancia_residencia, distancia: data.distancia },
                matricula: data.matricula,
                senha: data.senha,
                celula: { id: data.id_celula, nome: data.nome_celula },
                numProjeto: data.num_projeto,
                metragem: data.metragem,
                role: { id: data.id_role, nome: data.nome_role },
                membroAtivo: data.membro_ativo,
                dataCriacao: data.data_criacao
            };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Verifica se um usuário existe de acordo com um campo.
     * @param col - uma coluna da tabela shark no banco de dados.
     * @param data - o valor da coluna da tabela shark no banco de dados.
     * @returns uma promise do tipo boolean.
     */
    async userExists(col: string, data:string): Promise<boolean>
    {
        if( col === "email" || col === "matricula" || col === "cpf")
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
        try
        {
            let query = db(TableNames.shark).select(
                "s.id",
                "s.nome",
                "s.email",
                "ep.email as email_pessoal",
                "s.telefone",
                "s.cpf",
                "s.id_distancia_residencia",
                "dr.distancia",
                "s.matricula",
                "s.senha",
                "s.id_celula",
                "c.nome as nome_celula",
                "s.num_projeto",
                "s.metragem",
                "s.id_celula",
                "s.id_role",
                "r.nome as nome_role",
                "s.membro_ativo",
                "s.data_criacao"
            )
                .from(`${TableNames.shark} as s`)
                .innerJoin(`${TableNames.distancia_residencia} as dr`, "s.id_distancia_residencia", "dr.id")
                .innerJoin(`${TableNames.celula} as c`, "s.id_celula", "c.id")
                .innerJoin(`${TableNames.role} as r`, "s.id_role", "r.id")
                .leftJoin(`${TableNames.email_pessoal} as ep`, "ep.id_shark", "s.id");
                
            // params
            query = query.where("s.email", "=", email);
    
            const data =  await query.first();

            if(!data)
                return undefined;

            return {
                id: data.id,
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                cpf: data.cpf,
                distancia: { id: data.id_distancia_residencia, distancia: data.distancia },
                matricula: data.matricula,
                senha: data.senha,
                celula: { id: data.id_celula, nome: data.nome_celula },
                numProjeto: data.num_projeto,
                metragem: data.metragem,
                role: { id: data.id_role, nome: data.nome_role },
                membroAtivo: data.membro_ativo,
                dataCriacao: data.data_criacao
            };
        }
        catch (err) { throw new InternalServerError(String(err)); }
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
        if( col === "email" || col === "matricula" || col === "cpf")
        {
            const result = await db.raw(`SELECT * FROM ${TableNames.shark} WHERE id = ${id} AND ${col} = '${data}';`)
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
     * Insere os dados do shark na tabela shark, o email pessoal na tabela email_pessoal.
     * @param shark - os dados do tipo Shark
     * @param emailPessoal - os dados do tipo EmailPessoal
     * @returns uma promise com o id que foi inserido.
     */
    async insertAllData(shark: Shark, emailPessoal: EmailPessoal)
    {
        try
        {
            return await db.transaction(async (trx) => {
                // Insere na tabela shark
                const idSharkIserted = await trx(TableNames.shark).insert({
                    nome: shark.nome,
                    email: shark.email,
                    telefone: shark.telefone,
                    id_distancia_residencia: shark.distancia?.id ?? null,
                    cpf: shark.cpf,
                    matricula: shark.matricula,
                    senha: shark.senha,
                    id_celula: shark.celula.id,
                    num_projeto: shark.numProjeto,
                    metragem: shark.metragem,
                    id_role: shark.role?.id,
                    membro_ativo: shark.membroAtivo,
                    data_criacao: shark.dataCriacao
                })
                    .returning("id")
                    .then(row => { return row[0].id; });
                
                // Insere na tabela email_pessoal
                await trx(TableNames.email_pessoal).insert({
                    id_shark: idSharkIserted,
                    email: emailPessoal.email
                });

                return idSharkIserted;
            });
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Insere os dados do shark na tabela shark, o email pessoal na tabela email_pessoal.
     * @param shark - os dados do tipo Shark
     * @param emailPessoal - os dados do tipo EmailPessoal
     * @returns uma promise com o id que foi inserido.
     */
    async updateAllData(shark: Shark, emailPessoal: EmailPessoal)
    {
        let cols: any;
        
        try
        {
            if(shark.senha)
            {
                cols = {
                    nome: shark.nome,
                    email: shark.email,
                    telefone: shark.telefone,
                    id_distancia_residencia: shark.distancia?.id ?? null,
                    cpf: shark.cpf,
                    matricula: shark.matricula,
                    senha: shark.senha,
                    id_celula: shark.celula.id,
                    num_projeto: shark.numProjeto,
                    metragem: shark.metragem,
                    id_role: shark.role?.id,
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
                    cpf: shark.cpf,
                    matricula: shark.matricula,
                    id_celula: shark.celula.id,
                    num_projeto: shark.numProjeto,
                    metragem: shark.metragem,
                    id_role: shark.role?.id,
                    membro_ativo: shark.membroAtivo
                };
            }

            return await db.transaction(async (trx) => {
                // Impede de atualizar o user admin
                if(shark.id == 1)
                    throw new BadRequestError("Não foi possível atualizar este usuário.");

                // Atualiza na tabela shark
                const idSharkUpdated = await db(TableNames.shark)
                    .update(cols)
                    .where({ id: shark.id })
                    .returning("id")
                    .then(row => { return row[0].id; });
                
                // Atualiza na tabela email_pessoal
                await trx(TableNames.email_pessoal)
                    .update({
                        id_shark: shark.id,
                        email: emailPessoal.email
                    })
                    .where({ id_shark: shark.id });

                return idSharkUpdated;
            });
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

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

