import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.nivel_gratificacao, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 100).notNullable();
        table.smallint("valor").notNullable();
    }).then(()=> {
        console.log("Tabela " + TableNames.nivel_gratificacao + " criada.");

        return knex(TableNames.nivel_gratificacao).insert([
            { nome: "bom", valor: 1 },
            { nome: "ótimo", valor: 2 },
            { nome: "excelente", valor: 4 }
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.nivel_gratificacao + "." ));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.nivel_gratificacao)
        .then(() => {
            console.log("A tabela " + TableNames.nivel_gratificacao + " foi removida.");
        });
}


