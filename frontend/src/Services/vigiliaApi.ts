import axios from 'axios';
import { Partida } from '../Types/Rank';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL_VIGILIA = `${BASE_URL}/api/vigilia`;
const API_URL_VIGILIA_PRESENCA = `${BASE_URL}/api/vigilia/presenca`;

const vigiliaApi = {
  getSalas: async (): Promise<Partida[]> => {
    const response = await axios.get<Partida[]>(API_URL_VIGILIA);
    return response.data;
  },
  resetarTodasSalas: async (): Promise<void> => {
    await axios.post(`${API_URL_VIGILIA}/reset`);
  },
  adicionarMembroASala: async (salaId: number, membroId: number): Promise<Partida> => {
    const response = await axios.put<Partida>(`${API_URL_VIGILIA}/${salaId}/add/${membroId}`);
    return response.data;
  },
  removerMembroDaSala: async (salaId: number, membroId: number): Promise<Partida> => {
    const response = await axios.delete<Partida>(`${API_URL_VIGILIA}/${salaId}/remove/${membroId}`);
    return response.data;
  },
  resetarSala: async (salaId: number): Promise<void> => {
    await axios.post(`${API_URL_VIGILIA}/${salaId}/reset`);
  },
  // Novos métodos para presenças de Vigilia
  getPresencasPorVigilia: async (vigiliaId: number) => {
    const response = await axios.get(`${API_URL_VIGILIA_PRESENCA}/vigilia/${vigiliaId}`);
    return response.data;
  },
  getPresencasPorMembro: async (membroId: number) => {
    const response = await axios.get(`${API_URL_VIGILIA_PRESENCA}/membro/${membroId}`);
    return response.data;
  },
  getPresenca: async (membroId: number, vigiliaId: number) => {
    const response = await axios.get(`${API_URL_VIGILIA_PRESENCA}/${membroId}/${vigiliaId}`);
    return response.data;
  },
  salvarOuAtualizarPresenca: async (data: { membroId: number, vigiliaId: number, status: string, escalado: boolean }) => {
    const response = await axios.post(`${API_URL_VIGILIA_PRESENCA}`, data);
    return response.data;
  }
};

export default vigiliaApi; 