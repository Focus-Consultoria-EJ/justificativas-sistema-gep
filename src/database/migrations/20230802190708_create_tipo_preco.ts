import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.tipo_preco, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.tipo_preco + " criada.");

        return knex(TableNames.tipo_preco).insert([
            { nome: "preço piso" },
            { nome: "preço médio" },
            { nome: "preço teto" }
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.tipo_preco + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.tipo_preco)
        .then(() => {
            console.log("A tabela " + TableNames.tipo_preco + " foi removida.");
        });
}

