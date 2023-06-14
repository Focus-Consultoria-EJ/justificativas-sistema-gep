import bcrypt from "bcrypt";

// Criptografa a senha
const passwordEncrypt = async (password: string):Promise<string> => 
{
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(password, salt);
};

// Verifica se a senha digitada é igual
const passwordCompare = async (passwordA: string, passwordB: string):Promise<boolean> => 
{
    return await bcrypt.compareSync(passwordA, passwordB);
};

export 
{
    passwordEncrypt,
    passwordCompare
};