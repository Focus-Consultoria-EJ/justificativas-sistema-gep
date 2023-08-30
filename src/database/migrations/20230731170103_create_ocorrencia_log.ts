import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.ocorrencia_log, (table) => {
        table.increments("id").primary();
        table.smallint("id_tipo_acao_log").notNullable();
        table.smallint("id_ocorrencia").notNullable();
        table.smallint("id_shark_editor").notNullable();
        table.timestamp("data_acao").notNullable().defaultTo(knex.fn.now());

        table.foreign("id_tipo_acao_log")
            .references("id")
            .inTable(TableNames.tipo_acao_log)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table.foreign("id_shark_editor")
            .references("id")
            .inTable(TableNames.shark)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

    }).then(() => { console.log("Tabela " + TableNames.ocorrencia_log + " criada."); });
}


export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.ocorrencia_log)
        .then(() => {
            console.log("A tabela " + TableNames.ocorrencia_log + " foi removida.");
        });
}

