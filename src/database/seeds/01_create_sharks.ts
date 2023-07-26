import { Knex } from "knex";
import { passwordEncrypt } from "../../middlewares/password.middleware";
import { isNumber } from "../../helpers/validation";
import { TableNames } from "../TableNames";
import { Shark } from "../../models/Shark";

/**
 * Verifica se o número de itens a serem criados foi passado no cli. Se não, define o número de registros para 15.
 */
const numRegistros: number = isNumber(process.argv[process.argv.length - 1]) ? parseInt(process.argv[process.argv.length - 1]) : 15;

/**
 * Gera um número aleatório entre o valor mínimo e máximo.
 * @param min - o valor mínimo.
 * @param max - o valor máximo.
 * @returns o número gerado.
 */
const random = (min: number, max: number) => { return Math.floor(Math.random() * (max - min + 1)) + min; };

interface DadosToDB 
{
    nome: string, 
    email: string, 
    telefone: string,
    senha: string,
    matricula: string, 
    cpf: string,
    id_distancia_residencia: number, 
    id_celula: number,
    num_projeto: number,
    metragem: number,
    admin: number,
    membro_ativo: number
}

/**
 * Gera os índices a serem inseridos na tabela shark do banco de dados.
 * @param numRegistros - O número de registros a serem gerados na seed.
 * @returns uma promise contendo uma coleção de objetos relacionadas a tabela shark.
 */
const generateData = async (numRegistros: number) => {

    const nomes = ["Maria", "Pedro", "Ana", "Luiz", "Julia", "Fernando", "Carolina", "João", "Mariana", "Gabriel", "Lara", "Rafael", "Bianca", "Daniel", "Laura", "Lucas", "Isabela", "Gustavo", "Lívia", "Miguel", "Sophia", "Arthur", "Valentina", "Bernardo", "Larissa", "Matheus", "Alice", "Enzo", "Letícia", "Felipe"];
    const dadosGerados: DadosToDB[] = [];

    const dadosIniciais: Shark = { 
        nome: "João Paulo", 
        email: "emailtest1@hotmail.com", 
        senha: await passwordEncrypt("123456789"), // criptografa a senha
        matricula: "12345678910", 
        cpf: "123.456.789-00",
        distancia: { id: random(1, 3) }, 
        celula: { id: random(1, 6) },
        telefone: "22987654321",
        admin: random(0, 1),
        membroAtivo: random(0, 1)
    };

    for (let i = 0; i < numRegistros; i++)
    {
        const nome = nomes[random(0, nomes.length - 1)]; 
        const email = `emailtest${i}@hotmail.com`;
        const senha = dadosIniciais.senha!;
        const matricula = dadosIniciais.matricula! + i;
        const cpf = dadosIniciais.cpf = `123.456.789-${i < 10 ? "0"+String(i) : i}`;
        const distancia = random(1, 3);
        const celula = random(1, 6);
        const telefone = dadosIniciais.telefone!;
        const numProjeto = random(0, 10);
        const metragem = 24;
        const admin = random(0, 1);
        const membroAtivo = random(0, 1);

        dadosGerados.push({ nome, email, senha, matricula, cpf, id_distancia_residencia:distancia, id_celula: 
            celula, telefone, admin, membro_ativo: membroAtivo, num_projeto: numProjeto, metragem: metragem});
    }

    return dadosGerados;
};


export async function seed(knex: Knex) 
{
    const dadosGerados = await generateData(numRegistros);
    
    await knex(TableNames.shark).insert(dadosGerados);
}
