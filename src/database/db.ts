import { knex } from "knex";
import { development, production } from "../config/knexfile";

/**
 * Define a configuração do knex.
 * @returns um objeto contendo as configurações do knex.
 */
const getEnv = () => 
{
    switch(process.env.STATUS) 
    {
        case "production":
            return production;

        case "development":
            return development;

        default: 
            return development;
    }
};

const db = knex(getEnv());

export default db;
