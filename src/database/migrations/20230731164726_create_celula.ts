import { Knex } from "knex";
import { TableNames } from "../TableNames";

export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.celula, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.celula + " criada.");

        return knex(TableNames.celula).insert([
            { nome: "presidência" },
            { nome: "administração financeira" },
            { nome: "gestão estratégica de pessoas" },
            { nome: "marketing" },
            { nome: "comercial" },
            { nome: "projetos" },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.celula + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.celula)
        .then(() => {
            console.log("A tabela " + TableNames.celula + " foi removida.");
        });
}

