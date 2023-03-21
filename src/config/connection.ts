import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

// Configuração do knex com o mysql
const connection = knex({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: "knex_migrations"
    }
});

export default connection;