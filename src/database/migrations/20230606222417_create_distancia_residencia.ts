import { Knex } from "knex";
import { TableNames } from "../TableNames";

export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.distancia_residencia, (table) => {
        table.increments("id").primary().index();
        table.string("distancia", 300).notNullable();
    }).then(()=> {
        console.log("Tabela " + TableNames.distancia_residencia + " criada.");

        return knex(TableNames.distancia_residencia).insert([
            { distancia: "Perto" },
            { distancia: "Longe" },
            { distancia: "Muito Longe" },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.distancia_residencia + "." ));
}


export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.distancia_residencia)
        .then(() => {
            console.log("A tabela " + TableNames.distancia_residencia + " foi removida.");
        });
}

