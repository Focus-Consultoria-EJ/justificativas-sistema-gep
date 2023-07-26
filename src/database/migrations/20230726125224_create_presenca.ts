import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.presenca, (table) => {
        table.increments("id").primary();
        table.smallint("id_shark").notNullable();
        table.smallint("id_evento").notNullable();
        table.boolean("confirmado").notNullable().defaultTo(false);
        table.timestamp("data_acao").notNullable().defaultTo(knex.fn.now());
    
        table
            .foreign("id_shark")
            .references("id")
            .inTable(TableNames.shark)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    
        table
            .foreign("id_evento")
            .references("id")
            .inTable(TableNames.evento)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

    }).then(() => { console.log("Tabela " + TableNames.presenca + " criada."); });
        
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.presenca)
        .then(() => {
            console.log("A tabela " + TableNames.presenca + " foi removida.");
        });
}

