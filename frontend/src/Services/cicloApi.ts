import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL_CICLOS = `${BASE_URL}/api/ciclos`;

export interface Ciclo {
  id: number;
  nome: string;
  dataInicio: string;
  dataFim?: string;
  ativo: boolean;
  cicloVigilias?: CicloVigilia[];
}

export interface CicloVigilia {
  id: number;
  gestaoVigiliaId: number;
  gestaoVigiliaNome: string;
  ordem: number;
}

const cicloApi = {
  // Ciclos
  getCiclos: async (): Promise<Ciclo[]> => {
    console.log('Fazendo requisição para:', API_URL_CICLOS);
    const response = await axios.get(API_URL_CICLOS);
    console.log('Resposta da API ciclos:', response.data);
    return response.data;
  },

  getCiclosAtivos: async (): Promise<Ciclo[]> => {
    const response = await axios.get(`${API_URL_CICLOS}/ativos`);
    return response.data;
  },

  getCicloAtivo: async (): Promise<Ciclo | null> => {
    try {
      const response = await axios.get(`${API_URL_CICLOS}/ativo`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getCiclo: async (id: number): Promise<Ciclo> => {
    const response = await axios.get(`${API_URL_CICLOS}/${id}`);
    return response.data;
  },

  createCiclo: async (nome: string, vigiliaIds: number[]): Promise<Ciclo> => {
    console.log('Enviando dados para criar ciclo:', { nome, vigiliaIds });
    const response = await axios.post(API_URL_CICLOS, { nome, vigiliaIds });
    return response.data;
  },

  deleteCiclo: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL_CICLOS}/${id}`);
  },

  // Vigílias do Ciclo
  getVigiliasDoCiclo: async (cicloId: number): Promise<CicloVigilia[]> => {
    const response = await axios.get(`${API_URL_CICLOS}/${cicloId}/vigilias`);
    return response.data;
  }
};

export default cicloApi; 