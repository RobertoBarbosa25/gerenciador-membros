// src/Services/membrosApi.ts

import axios from 'axios';
import { Player, Partida } from '../Types/Rank'; // Importar Partida também

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:8080');
const API_URL_MEMBROS = `${BASE_URL}/api/membros`;
const API_URL_PARTIDAS = `${BASE_URL}/api/partidas`; // Novo URL para partidas

const membrosApi = {
    // --- Métodos para Membros (existentes) ---
    getMembros: async (filters?: { name?: string; memberClass?: string; cla?: string }, signal?: AbortSignal): Promise<Player[]> => {
        let url = API_URL_MEMBROS;
        if (filters && (filters.name || filters.memberClass || filters.cla)) {
            const params = new URLSearchParams();
            if (filters.name) params.append('name', filters.name);
            if (filters.memberClass) params.append('memberClass', filters.memberClass);
            if (filters.cla) params.append('cla', filters.cla);
            url += `/buscar?${params.toString()}`;
        }
        const response = await axios.get<Record<string, Player> | Player[]>(url, { signal });
        if (typeof response.data === 'object' && response.data !== null && !Array.isArray(response.data)) {
            return Object.values(response.data as Record<string, Player>);
        } else if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error("API getMembros retornou um formato inesperado:", response.data);
            return [];
        }
    },

    createMembro: async (membro: Omit<Player, 'id'>): Promise<Player> => {
        const response = await axios.post<Player>(API_URL_MEMBROS, membro);
        return response.data;
    },

    updateMembro: async (id: number, membro: Player): Promise<Player> => {
        const response = await axios.put<Player>(`${API_URL_MEMBROS}/${id}`, membro);
        return response.data;
    },

    deleteMembro: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL_MEMBROS}/${id}`);
    },

    // --- NOVO MÉTODO: Importação em Lote ---
    importMembrosBatch: async (membros: Omit<Player, 'id'>[]): Promise<{
        successCount: number;
        skippedCount: number;
        errorCount: number;
        successNames: string[];
        skippedNames: string[];
        errorMessages: string[];
    }> => {
        const response = await axios.post(`${API_URL_MEMBROS}/batch`, membros);
        return response.data;
    },

    deleteAllMembros: async (): Promise<void> => {
        try {
            await axios.delete(`${API_URL_MEMBROS}/all`);
        } catch (error) {
            console.error("Erro ao deletar todos os membros:", error);
            throw error;
        }
    }
};

export default membrosApi;