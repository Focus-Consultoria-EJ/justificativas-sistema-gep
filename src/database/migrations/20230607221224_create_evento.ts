import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.evento, (table) => {
        table.increments("id").primary();
        table.string("titulo", 300).notNullable();
        table.string("descricao", 2000);
        table.timestamp("data_acao").notNullable().defaultTo(knex.fn.now());
        table.timestamp("data_termino").defaultTo(knex.raw("(CURRENT_DATE + INTERVAL '1 DAY')"));

    }).then(() => { console.log("Tabela " + TableNames.evento + " criada."); });
}


export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.evento)
        .then(() => {
            console.log("A tabela " + TableNames.evento + " foi removida.");
        });
}

