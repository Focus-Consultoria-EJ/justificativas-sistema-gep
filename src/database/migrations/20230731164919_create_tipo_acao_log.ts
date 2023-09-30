import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.tipo_acao_log, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 40).notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.tipo_acao_log + " criada.");

        return knex(TableNames.tipo_acao_log).insert([
            { nome: "inserção" },
            { nome: "atualização" },
            { nome: "remoção" }
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.tipo_acao_log + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.tipo_acao_log)
        .then(() => {
            console.log("A tabela " + TableNames.tipo_acao_log + " foi removida.");
        });
}

