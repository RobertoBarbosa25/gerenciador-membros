// src/Services/membrosApi.ts
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:8080');
const API_URL_MEMBROS = `${BASE_URL}/api/membros`;
const API_URL_PARTIDAS = `${BASE_URL}/api/partidas`; // Novo URL para partidas
const membrosApi = {
    // --- Métodos para Membros (existentes) ---
    getMembros: async (filters, signal) => {
        let url = API_URL_MEMBROS;
        if (filters && (filters.name || filters.memberClass || filters.cla)) {
            const params = new URLSearchParams();
            if (filters.name)
                params.append('name', filters.name);
            if (filters.memberClass)
                params.append('memberClass', filters.memberClass);
            if (filters.cla)
                params.append('cla', filters.cla);
            url += `/buscar?${params.toString()}`;
            console.log('🔍 API: getMembros com filtros:', filters);
        }
        else {
            console.log('📋 API: getMembros sem filtros (todos os membros)');
        }
        const response = await axios.get(url, { signal });
        if (typeof response.data === 'object' && response.data !== null && !Array.isArray(response.data)) {
            return Object.values(response.data);
        }
        else if (Array.isArray(response.data)) {
            return response.data;
        }
        else {
            console.error("API getMembros retornou um formato inesperado:", response.data);
            return [];
        }
    },
    createMembro: async (membro) => {
        const response = await axios.post(API_URL_MEMBROS, membro);
        return response.data;
    },
    updateMembro: async (id, membro) => {
        const response = await axios.put(`${API_URL_MEMBROS}/${id}`, membro);
        return response.data;
    },
    deleteMembro: async (id) => {
        await axios.delete(`${API_URL_MEMBROS}/${id}`);
    },
    // --- NOVO MÉTODO: Importação em Lote ---
    importMembrosBatch: async (membros) => {
        const response = await axios.post(`${API_URL_MEMBROS}/batch`, membros);
        return response.data;
    },
    deleteAllMembros: async () => {
        try {
            await axios.delete(`${API_URL_MEMBROS}/all`);
            console.log("Todos os membros foram deletados com sucesso no backend.");
        }
        catch (error) {
            console.error("Erro ao deletar todos os membros:", error);
            throw error;
        }
    }
};
export default membrosApi;
