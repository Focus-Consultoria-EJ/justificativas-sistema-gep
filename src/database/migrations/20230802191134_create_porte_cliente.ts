import { Knex } from "knex";
import { TableNames } from "../TableNames";

export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.porte_cliente, (table) => {
        table.increments("id").primary().index();
        table.string("tipo", 60).notNullable();
        table.float("desconto").notNullable();
    }).then(() => {
        console.log("Tabela " + TableNames.porte_cliente + " criada.");

        return knex(TableNames.porte_cliente).insert([
            { tipo: "empreendedor", desconto: 0 },
            { tipo: "micro empresa", desconto: 0.05 },
            { tipo: "pequeno porte", desconto: 0.1 },
            { tipo: "médio porte", desconto: 0.3 },
            { tipo: "grande porte", desconto: 0.4 },
        ]);
    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.porte_cliente + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.porte_cliente)
        .then(() => {
            console.log("A tabela " + TableNames.porte_cliente + " foi removida.");
        });
}

