
/**
 * Ordena os dados retornados do banco de dados (ORDER BY).
 * @param order - texto indicando se é crescente ou decrescente (asc, ASC, desc ou DESC).
 * @param defaultValue - o valor padrão caso o teste não seja sucedido. (default ASC)
 * @returns a string referente a forma de ordenação.
 */
export const orderByParameter = (order?: string, defaultValue = "ASC") => {
    return (order && ["asc", "ASC", "desc", "DESC"].includes(order)) ? order : defaultValue;
};

/**
 * Limita os dados retornados do banco de dados (LIMIT).
 * @param size - o valor indicando o número de dados retornados. Se size < 1, então retorna 99999.
 * @param defaultValue - valor padrão caso o teste não seja sucedido. (default 20)
 * @returns o valor referente a quantidade a ser retornada.
 */
export const sizeParameter = (size?: number, defaultValue = 20) => {
    return (size && size > 0) ? size : (( size && size < 1) ? 99999 : defaultValue);
};

/**
 * indica o início da leitura dos registros retornados do banco de dados (OFFSET).
 * @param page - o valor indicando o número de dados a serem pulados. Se page < 1, então retorna o default.
 * @param defaultValue - valor padrão caso o teste não seja sucedido. (default 20)
 * @returns o valor referente a quantidade a ser retornada.
 */
export const pageParameter = (page?: number, defaultValue = 0) => {
    return (page && page > 0) ? page : defaultValue;
};

/**
 * indica se o valor do membro ativo dos dados retornados do banco de dados (OFFSET).
 * @param membroAtivo - o valor booleano indicando se o membro é ativo ou não ao retornar uma consulta.
 * @param defaultValue - valor padrão caso o teste não seja sucedido. (default undefined).
 * @returns um texto ou undefined.
 */
export const membroAtivoParameter = (membroAtivo?: string, defaultValue?: string) => {
    return (membroAtivo && ["true", "TRUE", "false", "FALSE"].includes(membroAtivo)) ? membroAtivo : defaultValue ?? undefined;
};