import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL_PARTIDAS = `${BASE_URL}/api/partidas`;
const ritoApi = {
    getPartidas: async () => {
        const response = await axios.get(API_URL_PARTIDAS);
        return response.data;
    },
    inicializarPartidasBackend: async () => {
        const response = await axios.post(`${API_URL_PARTIDAS}/inicializar`);
        return response.data;
    },
    addMembroToPartida: async (partidaId, membroId) => {
        const response = await axios.put(`${API_URL_PARTIDAS}/${partidaId}/membros/${membroId}`);
        return response.data;
    },
    removeMembroFromPartida: async (partidaId, membroId) => {
        const response = await axios.delete(`${API_URL_PARTIDAS}/${partidaId}/membros/${membroId}`);
        return response.data;
    },
    updatePartidaName: async (partidaId, newName) => {
        const response = await axios.put(`${API_URL_PARTIDAS}/${partidaId}/nome`, newName, { headers: { 'Content-Type': 'text/plain' } });
        return response.data;
    }
};
export default ritoApi;
