import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.role, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 60).notNullable();
    }).then(()=> {
        console.log("Tabela " + TableNames.role + " criada.");

        return knex(TableNames.role).insert([
            { nome: "member" },
            { nome: "admin" },
            { nome: "dev" },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.role + "." ));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.role)
        .then(() => {
            console.log("A tabela " + TableNames.role + " foi removida.");
        });
}


