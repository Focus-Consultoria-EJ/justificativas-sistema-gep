# O deploy foi inicialmente pensado para a heroku
## Deploy do app 

- **Passo 1**: subir a aplicação no github
- **Passo 2**: criar um novo app no site do heroku e adicionar o nome do app
- **Passo 3**: acessar a aplicação, clicar na aba 'Deploy' e vincular o heroku com o github
- **Passo 4**: escolher o branch e fazer o deploy
- **Passo 5**: acessar a aba de 'Settings' e definir as seguintes variáveis de ambiente:
    - `JWT_SECRET_TOKEN` seguido do código secreto que queremos
    - `JWT_EXPIRES_IN` seguindo do tempo de duração do código JWT (por padrão está definido 1d)
    - `MAILER_HOST` seguido do servidor de e-mail utilizado, no caso do gmail 'smtp.gmail.com'
    - `MAILER_PORT` seguido da porta utilizada pelo servidor, no caso do gmail '465'
    - `MAILER_AUTH_USER ` seguido do e-mail que irá lançar os e-mails, ex: 'example@gmail.com'
    - `MAILER_AUTH_PASS` seguido da senha associada ao e-mail 
    - `URL_FRONT_END` = url do front-end, ex: https://url-frontend.com.br (Sem a barra no final!)
    - `ENABLE_UPLOAD_FILES` = habilita o upload/remoção de arquivos no drive, por default é true 
    - `ID_GOOGLE_FOLDER` = Se a variável ENABLE_UPLOAD_FILES for true, deve ser passado aqui o id da pasta
    do google drive que foi compartilhada. (Normalmente este id está na URL quando se está dentro da pasta)
    (ATENÇÃO: baixar o arquivo .json com as credenciais no site do google API, renomea-lo como 'google_api_credentials.json' e inseri-lo dentro da pasta src/config)

## Deploy do Google Drive (Habilitando o upload de arquivos)

Observação: estes links contém informações de como configurar o node.js para se comunicar com a API do google
- https://developers.google.com/drive/api/quickstart/nodejs?hl=pt-br
- https://www.youtube.com/watch?v=gErpJee99Fs

- **Passo 1**: acesse este link para habilitar o uso da API: https://console.cloud.google.com/projectselector2/apis/enableflow?apiid=drive.googleapis.com&hl=pt-br&pli=1&supportedpurview=project
- **Passo 2**: clicar em 'Novo Projeto' e insira o nome do projeto e a organização (caso não tenha organização clique em 'Sem Organização'). Clique em próximo e 'Ativar'.
- **Passo 3**: acesse a página de 'Tela de permissão OAuth', no link: https://console.cloud.google.com/apis/credentials/consent/edit;newAppInternalUser=false?hl=pt-br&project=sistema-rh-upload-drive .
Preencha os campos obrigatórios e clique em 'Salvar e continuar'. Por fim, avance todos os próximos campos,
não é necessário preenche-los.
- **Passo 4**: após criado a conta de permissão, acesse na barra de pesquisa a tela do google drive API (https://console.cloud.google.com/marketplace/product/google/drive.googleapis.com?q=search&referrer=search&hl=pt-br&project=sistema-rh-upload-drive), clique em 'Gerenciar' e clique em 'criar credenciais'. Selecione a opção 'Conta de serviço', preencha os campos e clique em 'Continuar' para avançar para o próximo item. No item 'conceder acesso a esta conta' procure pela opção 'Proprietário' e clique continuar.
Por fim, clique em continuar novamente e será gerado a credencial.
- **Passo 5**: acesse a conta de serviço gerada e clique na aba de 'Chaves' e clique em 'Adicionar Chave'. Selecione a opção Tipo de Chave 'JSON' e clique em criar. Será feito o download do arquivo.
- **Passo 6**: renomeie o arquivo baixado para `google_api_credentials.json` e o insira dentro da pasta do projeto na mesma área do index.ts ou seja, em `/src`.
- **Passo 7**: acesse a página do google drive (https://drive.google.com/drive/my-drive) e crie uma pasta que será utilizada para o armazenamento dos arquivos (ex: `sistema-rh-uploads`). Depois de criada, acesse a pasta, clique no nome dela e em 'Partilhar'. IMPORTANTE: aqui no partilhar você deve inserir o e-mail gerado na conta de serviço ao habilitar o uso da API, ele está localizado na aba 'contas de serviço' no google cloud. Exemplo de e-mail: `sistema-rh-focus@sistema-rh-upload-drive.iam.gserviceaccount.com`. Adicione o e-mail e o deixe com o tipo de acesso 'Editor', por fim, basta clicar em 'Enviar'.
- **Passo 8**: ainda na pasta do google drive, habilite em 'Partilhar' o acesso geral para 'Qualquer pessoa com o link' como 'Leitor. (Isso é importante para poder visualizar o item no front-end)
- **Passo 9**: na url da pasta criada no drive, copie o id do google e o insira na variável de ambiente `ID_GOOGLE_FOLDER` no heroku (caso esteja usando no local, adicione no arquivo .env). Exemplo de id do google: https://drive.google.com/drive/folders/1bANwIvdacNGzywjxwKD9-R7HIK6RNyDN aqui nesta url o id é `1bANwIvdacNGzywjxwKD9-R7HIK6RNyDN`.
- **Passo 10**: por fim, se necessário reinicie o projeto

## Deploy do DB

- **Passo 1**: acessar a aba 'Resources' do app
- **Passo 2**: selecionar o banco de dados postgresql, o plano desejado e aguardar o tempo de criação do bd
- **Passo 3**: certfique-se de que o HerokuCLI esteja instalado (https://devcenter.heroku.com/articles/heroku-cli)
- **Passo 4**: realize o login no heroku, digite o comando 'heroku login'
- **Passo 5**: acesse o app através do comando: 'heroku run bash --app nome-do-app-no-heroku'. Ex: `heroku run bash --app backend-gep-postgresql`.
- **Passo 6**: digitar o comando `npm i dotenv` e depois, `npm i`
- **Passo 7**: Atenção! o comando abaixo para o deploy do banco de dados. Se já houver dados importantes, é necessário fazer um backup.
    - O comando `npm run knex:latest:production`, serve para criar as tabelas no banco.
    
**Caso seja necessário remover os dados usar o use o comando a seguir: O comando `knex:rollback:production`, serve para apagar todas as tabelas do banco**
            

O retorno esperado do passo 6 é:
A variável de ambiente DATABASE_URL não foi setada ou é inválida. (se em desenvolvimento ignorar)
Using environment: development
Tabela distancia_residencia criada.
Registros inseridos na tabela distancia_residencia.
Tabela celula criada.
Registros inseridos na tabela celula.
Tabela role criada.
Registros inseridos na tabela role.
Tabela shark criada.
Registro inserido na tabela shark.
Tabela email_pessoal criada.
Tabela tipo_acao_log criada.
Registros inseridos na tabela tipo_acao_log.
Tabela tipo_ocorrencia criada.
Registros inseridos na tabela tipo_ocorrencia.
Tabela tipo_assunto criada.
Registros inseridos na tabela tipo_assunto.
Tabela shark_log criada.
Tabela nivel_advertencia criada.
Registros inseridos na tabela nivel_advertencia.
Tabela nivel_gratificacao criada.
Registros inseridos na tabela nivel_gratificacao.
Tabela ocorrencia criada.
Tabela ocorrencia_log criada.
Função de metragem criada
Trigger de inserção de metragem criada
Trigger de atualização de metragem criada
Trigger de devolução de metragem criada
Tabela upload_file criada.
Batch 1 run: 15 migrations