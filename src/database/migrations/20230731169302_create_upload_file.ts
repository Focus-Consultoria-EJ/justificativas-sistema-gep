import { Knex } from "knex";
import { TableNames } from "../TableNames";

export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.upload_file, (table) => {
        table.increments("id").primary();
        table.string("google_drive_id", 255).notNullable();
        table.string("nome_arquivo", 255).notNullable();
        table.string("tipo_arquivo", 50).notNullable();
        table.smallint("id_ocorrencia").notNullable();
        table.timestamp("data_criacao").defaultTo(knex.fn.now());
    
        table
            .foreign("id_ocorrencia")
            .references("id")
            .inTable(TableNames.ocorrencia)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

    }).then(() => { console.log("Tabela " + TableNames.upload_file + " criada."); });
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.upload_file)
        .then(() => {
            console.log("A tabela " + TableNames.upload_file + " foi removida.");
        });
}

