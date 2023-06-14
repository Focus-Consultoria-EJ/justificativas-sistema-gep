import { Knex } from "knex";
import { TableNames } from "../TableNames";

export async function up(knex: Knex): Promise<void> 
{
    return await knex.schema.createTable(TableNames.shark, (table) => {
        table.increments("id").primary().index();
        table.string("nome", 300).notNullable();
        table.string("email", 100).notNullable();
        table.string("telefone", 14);
        table.smallint("id_distancia_residencia");
        table.string("matricula", 15).notNullable();
        table.string("senha", 120).notNullable();
        table.smallint("id_celula").notNullable();
        table.smallint("num_projeto").notNullable().defaultTo(0);
        table.smallint("metragem").notNullable().defaultTo(24);
        table.boolean("admin").notNullable().defaultTo(false);
        table.boolean("membro_ativo").defaultTo(true);
        table.timestamp("data_criacao").notNullable().defaultTo(knex.fn.now());
  
        table
            .foreign("id_distancia_residencia")
            .references("id")
            .inTable(TableNames.distancia_residencia)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table
            .foreign("id_celula")
            .references("id")
            .inTable(TableNames.celula)
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

    }).then(() => {
        console.log("Tabela " + TableNames.shark + " criada.");
        
        return knex(TableNames.shark).insert({
            nome: "admin",
            email: "admin@hotmail.com",
            matricula: "000000000",
            id_distancia_residencia: 1,
            senha: "$2b$10$nFpL8mEl54cDYFYSQriSBOt1qqp2h9rg2x2gAmgAXbOlKJVo7XRb6",
            id_celula: 3,
            admin: true,
        });
    }).then(()=> console.log("Registro inserido na tabela " + TableNames.shark + "."));
}

export async function down(knex: Knex): Promise<void> 
{
    return await knex.schema.dropTable(TableNames.shark)
        .then(() => {
            console.log("A tabela " + TableNames.shark + " foi removida.");
        });
}

