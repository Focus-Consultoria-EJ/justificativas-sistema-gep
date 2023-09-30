import bcrypt from "bcrypt";

/**
 * Criptografa a senha.
 * @param password - a senha a ser criptografada. 
 * @returns uma promise com o hash. 
 */
const passwordEncrypt = async (password: string):Promise<string> => 
{
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(password, salt);
};

/**
 * Verifica se a senha digitada é igual a outra senha.
 * @param passwordA - a primeira senha a ser comparada.
 * @param passwordB - a segunda senha a ser comparada.
 * @returns retorna um promise do tipo boolean indicando se a senha é igual.
 */
const passwordCompare = async (passwordA: string, passwordB: string):Promise<boolean> => 
{
    return await bcrypt.compareSync(passwordA, passwordB);
};

export 
{
    passwordEncrypt,
    passwordCompare
};