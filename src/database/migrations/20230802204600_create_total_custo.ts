import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.total_custo, (table) => {
        table.increments("id").primary().index();
        table.float("resultado").notNullable();
        table.timestamp("data_criacao").defaultTo(knex.fn.now());

    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.total_custo + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.total_custo)
        .then(() => {
            console.log("A tabela " + TableNames.total_custo + " foi removida.");
        });
}

