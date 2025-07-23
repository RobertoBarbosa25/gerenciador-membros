import axios from 'axios';
import { Partida } from '../Types/Rank';

const API_URL_VIGILIA = 'http://localhost:8080/api/vigilia';

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
  }
};

export default vigiliaApi; 