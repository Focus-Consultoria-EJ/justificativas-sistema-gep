import { Knex } from "knex";
import { TableNames } from "../TableNames";

export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.email_pessoal, (table) => {
        table.increments("id").primary().index();
        table.smallint("id_shark").notNullable();
        table.string("email", 100).notNullable().unique();
  
        table
            .foreign("id_shark")
            .references("id")
            .inTable(TableNames.shark)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

    }).then(()=> console.log("Tabela " + TableNames.email_pessoal + " criada."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.email_pessoal)
        .then(() => {
            console.log("A tabela " + TableNames.email_pessoal + " foi removida.");
        });
}

