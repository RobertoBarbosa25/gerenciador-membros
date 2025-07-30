import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL_VIGILIAS = `${BASE_URL}/api/gestao/vigilias`;
const API_URL_PRESENCA = `${BASE_URL}/api/gestao/presenca`;

const gestaoVigiliaApi = {
  // Vigílias
  getVigilias: async () => {
    const response = await axios.get(API_URL_VIGILIAS);
    return response.data;
  },
  createVigilia: async (nome: string) => {
    const response = await axios.post(API_URL_VIGILIAS, { nome });
    return response.data;
  },
  deleteVigilia: async (id: number) => {
    await axios.delete(`${API_URL_VIGILIAS}/${id}`);
  },

  // Presenças
  getPresencasPorVigilia: async (vigiliaId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/vigilia/${vigiliaId}`);
    return response.data;
  },
  getPresencasPorMembro: async (membroId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/membro/${membroId}`);
    return response.data;
  },
  getPresenca: async (membroId: number, vigiliaId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/${membroId}/${vigiliaId}`);
    return response.data;
  },
  salvarOuAtualizarPresenca: async (data: { membroId: number, gestaoVigiliaId: number, cicloId: number, status: string, escalado: boolean }) => {
    const response = await axios.post(`${API_URL_PRESENCA}`, data);
    return response.data;
  },

  // Novos métodos para trabalhar com ciclos
  getPresencasPorCiclo: async (cicloId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/ciclo/${cicloId}`);
    return response.data;
  },
  getPresencasPorCicloEVigilia: async (cicloId: number, vigiliaId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/ciclo/${cicloId}/vigilia/${vigiliaId}`);
    return response.data;
  },
  getPresencasPorCicloEMembro: async (cicloId: number, membroId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/ciclo/${cicloId}/membro/${membroId}`);
    return response.data;
  },

  // Buscar histórico completo de um ciclo
  getHistoricoCompletoDoCiclo: async (cicloId: number) => {
    const response = await axios.get(`${API_URL_PRESENCA}/ciclo/${cicloId}/historico`);
    return response.data;
  },

  // Buscar membros escalados nas salas da vigília
  getMembrosEscalados: async () => {
    const response = await axios.get(`${API_URL_VIGILIAS}/membros-escalados`);
    return response.data;
  },

};

export default gestaoVigiliaApi; 