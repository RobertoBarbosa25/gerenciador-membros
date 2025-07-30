import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/batch`;

export const batchApi = {
  // Teste simples para verificar se o controller está funcionando
  teste: async () => {
    const response = await axios.get(`${API_URL}/teste`);
    return response.data;
  },

  // Buscar todos os dados iniciais de uma vez
  getDadosIniciais: async () => {
    const response = await axios.get(`${API_URL}/dados-iniciais`);
    return response.data;
  },

  // Buscar dados específicos de uma vigília
  getDadosVigilia: async (cicloId: number, vigiliaId: number) => {
    const response = await axios.get(`${API_URL}/dados-vigilia/${cicloId}/${vigiliaId}`);
    return response.data;
  },

  // Buscar todas as presenças de um ciclo
  getPresencasCiclo: async (cicloId: number) => {
    const response = await axios.get(`${API_URL}/presencas-ciclo/${cicloId}`);
    return response.data;
  },

  salvarPresencasEmLote: async (presencasData: Array<{
    membroId: number;
    gestaoVigiliaId: number;
    cicloId: number;
    status: string;
    escalado: boolean;
  }>) => {
    try {
      const response = await axios.post(`${API_URL}/salvar-presencas`, presencasData);
      return response.data;
    } catch (error) {
      console.error('Erro no salvamento em lote:', error);
      throw error;
    }
  }
}; 