// Este arquivo serve de configuração para o pm2, ele habilita todos os núcleos da instância
module.exports = {
    apps : [
        {
            name: `backend-gep`,
            script: './dist/index.js',
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "localhost"
            },
            env_development: {
                NODE_ENV: process.env.NODE_ENV
            },
            env_staging: {
                NODE_ENV: process.env.NODE_ENV
            },
            env_production: {
                NODE_ENV: process.env.NODE_ENV
            }
        }
    ],
};