// src/Utils/normalizeString.ts
export const normalizeString = (str) => {
    return str
        .normalize("NFD") // Normaliza para forma de decomposição (separa letras de acentos)
        .replace(/[\u0300-\u036f]/g, "") // Remove caracteres diacríticos (acentos)
        .toLowerCase(); // Converte para minúsculas
};
