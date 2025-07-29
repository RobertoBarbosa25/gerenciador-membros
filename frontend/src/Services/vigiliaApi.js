import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL_VIGILIA = `${BASE_URL}/api/vigilia`;
const vigiliaApi = {
    getSalas: async () => {
        const response = await axios.get(API_URL_VIGILIA);
        return response.data;
    },
    resetarTodasSalas: async () => {
        await axios.post(`${API_URL_VIGILIA}/reset`);
    },
    adicionarMembroASala: async (salaId, membroId) => {
        const response = await axios.put(`${API_URL_VIGILIA}/${salaId}/add/${membroId}`);
        return response.data;
    },
    removerMembroDaSala: async (salaId, membroId) => {
        const response = await axios.delete(`${API_URL_VIGILIA}/${salaId}/remove/${membroId}`);
        return response.data;
    },
    resetarSala: async (salaId) => {
        await axios.post(`${API_URL_VIGILIA}/${salaId}/reset`);
    }
};
export default vigiliaApi;
