#Requisitos para o sistema
### Setup de ambiente:
- [Node LTS ou 18.x](https://nodejs.org/en)
- [PostgesSQL 15.x](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- [Pgadmin 6.x](https://www.pgadmin.org/download/)

### Como executar o sistema localmente?
- Se não houver database criado, crie através do comando `CREATE DATABASE db_focus_gep_backend;` no pgadmin.
- Clone o projeto `git clone https://github.com/ConsultoriaFocus/sistema-de-notifica-es-back-end.git`
- Execute npm i (para instalar as dependências)
- Abra o arquivo `./src/config/knexfile.ts` e em `development` adicione o **database**, o **user**, a **password**, a **port** (o default é 5432) e o **host** (para local será 'localhost')
- Execute o comando `npm run knex:migrate:latest` (para criar as tabelas no bando de dados)
- Execute o comando `npm run develop`

## Estrutura do sistema
- `./src/@types`: Contém um arquivo que cria uma variável do tipo Shark e define dentro do express para que ela exista dentro da requisição.
- `./src/config`: Possui os arquivos com as configurações de tools, por exemplo o knex.
- `./src/controllers`: Nesta pasta estão os arquivos responsáveis pelas requisições de usuário.
- `./src/database`: Aqui ficam os arquivos relacionados ao banco de dados.
    - O arquivo `./src/database/TableNames.ts` contém um enum onde estão o nome de todas as tabelas. Estes nomes são utilizados nas migrations e repositories. 
    - `./src/database/migrations`: Contém os arquivos gerados pelo comando `npm run knex:migrate:make create_[nome da tabela]` que geram as tabelas.
    - `./src/database/repositories`: São todos as operações executadas nas tabelas do bando de dados.
- `./src/helpers`: Possui arquivos que auxiliam em alguma funcionalidade. Por exemplo: os arquivos `./src/helpers/ocorrenciaValidation.ts` e `./src/helpers/sharkValidation.ts` tratam os dados vindo da requisição de usuário. 
- `./src/middlewares`: Arquivos responsáveis por funcionalidades importantes do código. Por exemplo: o arquivo `./src/middlewares/Error.middleware.ts` é um arquivo para tratamento de erros
- `./src/middlewares`: Contém os modelos (ou interfaces).
- `./src/routes`: Contém as rotas da API.
- `./src/services`: Aqui contém os arquivos responsáveis pelo processamento do sistema.
    - Por exemplo: `./src/routes/celula/delete.celula.service.ts` é um service responsável pela execução de um comando da `CelulaRepository` responsável pelo **SELECT** das células.
    - Outro exemplo: `./src/routes/jwt` possui um service responsável pela geração e verificação de tokens
