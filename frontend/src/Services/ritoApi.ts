import axios from 'axios';
import { Partida, Player } from '../Types/Rank';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL_PARTIDAS = `${BASE_URL}/api/partidas`;

const ritoApi = {
  getPartidas: async (): Promise<Partida[]> => {
    const response = await axios.get<Partida[]>(API_URL_PARTIDAS);
    return response.data;
  },
  inicializarPartidasBackend: async (): Promise<string> => {
    const response = await axios.post<string>(`${API_URL_PARTIDAS}/inicializar`);
    return response.data;
  },
  addMembroToPartida: async (partidaId: number, membroId: number): Promise<Partida> => {
    const response = await axios.put<Partida>(`${API_URL_PARTIDAS}/${partidaId}/membros/${membroId}`);
    return response.data;
  },
  removeMembroFromPartida: async (partidaId: number, membroId: number): Promise<Partida> => {
    const response = await axios.delete<Partida>(`${API_URL_PARTIDAS}/${partidaId}/membros/${membroId}`);
    return response.data;
  },
  updatePartidaName: async (partidaId: number, newName: string): Promise<Partida> => {
    const response = await axios.put<Partida>(
      `${API_URL_PARTIDAS}/${partidaId}/nome`,
      newName,
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data;
  }
};

export default ritoApi; 