import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.nivel_advertencia, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 100).notNullable();
        table.smallint("valor").notNullable();
    }).then(()=> {
        console.log("Tabela " + TableNames.nivel_advertencia + " criada.");

        return knex(TableNames.nivel_advertencia).insert([
            { nome: "leve", valor: 2 },
            { nome: "moderado", valor: 4 },
            { nome: "grave", valor: 6 },
            { nome: "gravíssima", valor: 8 },
            { nome: "gravíssima", valor: 10 }
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.nivel_advertencia + "." ));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.nivel_advertencia)
        .then(() => {
            console.log("A tabela " + TableNames.nivel_advertencia + " foi removida.");
        });
}


