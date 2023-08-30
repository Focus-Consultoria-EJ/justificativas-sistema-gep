import dotenv from "dotenv";
import { Knex } from "knex";
import path from "path";
dotenv.config();
const URL = process.env.DATABASE_URL ?? "";

interface IDBConnection 
{
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    name: string;
}

const dbConnection:IDBConnection = { database: "", host: "", name: "", password: "", port: 0, user: ""};

if(URL === "" || !URL.includes("//") || !URL.includes(":") || !URL.includes("@") || !URL.includes("/"))
    console.log("A variável de ambiente DATABASE_URL não foi setada ou é inválida. (se em desenvolvimento ignorar)");
else
{
    // Extrai as informações do URL
    const uri = URL.split("//")[1];
    dbConnection.user = uri.split(":")[0]; 
    dbConnection.password = uri.split(":")[1].split("@")[0];
    dbConnection.host = uri.split(":")[1].split("@")[1];
    dbConnection.port = Number(uri.split(":")[2].split("/")[0]);
    dbConnection.name = uri.split(":")[2].split("/")[1];
}

export const production: Knex.Config = {
    client: "postgresql",
    connection: {
        host: dbConnection.host,
        port: dbConnection.port,
        database: dbConnection.name,
        user: dbConnection.user,
        password: dbConnection.password,
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 10,
        afterCreate: (conn: any, done: any) => {
            done();
        }
    },
    migrations: {
        directory: path.resolve(__dirname, "..", "database", "migrations")
    },
    seeds: {
        directory: path.resolve(__dirname, "..", "database", "seeds")
    }
};

export const development: Knex.Config = {
    client: "postgresql",
    connection: {
        host: "localhost",
        port: 5432,
        database: "db_focus_gep_backend_test_upload",
        user: "postgres",
        password: "root"
    },
    pool: {
        min: 2,
        max: 10,
        afterCreate: (conn: any, done: any) => {
            done();
        }
    },
    migrations: {
        directory: path.resolve(__dirname, "..", "database", "migrations")
    },
    seeds: {
        directory: path.resolve(__dirname, "..", "database", "seeds")
    }
};