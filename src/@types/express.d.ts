import Shark from "../model/Shark";

/**
 * Faz com que a variável shark exista dentro da Requisição
 * Express. Com isso, é possível resgatar os dados de
 * usuário na sessão.
 *
 *** Dentro de tsconfig.json está configurado o caminho para este arquivo
 *** "typeRoots": ["./src/@types"]
 */

declare global
{
    namespace Express
    {
        export interface Request
        {
            shark: Partial<Shark>;
        }
    }
}