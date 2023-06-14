import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.tipo_assunto, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.tipo_assunto + " criada.");

        return knex(TableNames.tipo_assunto).insert([
            { nome: "Plantão" },
            { nome: "Reunião de célula" },
            { nome: "Reunião geral" },
            { nome: "Reunião de projetos" },
            { nome: "Shark-in ou Shark-out" },
            { nome: "Treinamento" },
            { nome: "Outros" },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.tipo_assunto + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.tipo_assunto)
        .then(() => {
            console.log("A tabela " + TableNames.tipo_assunto + " foi removida.");
        });
}

