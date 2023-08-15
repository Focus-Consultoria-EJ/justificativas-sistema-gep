import { Knex } from "knex";
import { TableNames } from "../TableNames";


export async function up(knex: Knex): Promise<void>
{
    return await knex.schema.createTable(TableNames.cliente, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
        table.string("nome_empresa", 500).notNullable();
        table.string("tipo_cliente", 300).notNullable();
        table.smallint("idade");
        table.string("negociador", 300).notNullable();
        table.string("estado", 150).notNullable();
        table.string("cidade", 150).notNullable();
        table.string("sexo", 100);
        table.timestamp("data_criacao").defaultTo(knex.fn.now());
        table.smallint("id_porte_cliente").notNullable();

        table
            .foreign("id_porte_cliente")
            .references("id")
            .inTable(TableNames.porte_cliente)
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

    }).then(()=> console.log("Registros inseridos na tabela " + TableNames.cliente + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.cliente)
        .then(() => {
            console.log("A tabela " + TableNames.cliente + " foi removida.");
        });
}

