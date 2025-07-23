import { useState, useCallback } from 'react';
import { Player } from '../../../Types/Rank.types';
import ritoApi from '../../../Services/ritoApi';
import { MAX_ATTACK_PLAYERS } from '../Rito.utils';
import { toast } from 'react-toastify';

// Adiciona o campo 'tipo' à tipagem de Partida
type Partida = {
    id: number;
    nome: string;
    membros: Player[];
    capacidadeMaximaJogadores: number;
    tipo?: string;
};

export function usePartidas() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [isLoadingPartidas, setIsLoadingPartidas] = useState<boolean>(true);

  const fetchPartidas = useCallback(async () => {
    setIsLoadingPartidas(true);
    try {
      const data = await ritoApi.getPartidas();
      // Filtra apenas partidas do tipo RITO
      const formattedPartidas: Partida[] = data
        .filter((p: Partida) => p.tipo === "RITO")
        .map((p: Partida) => ({
          ...p,
          capacidadeMaximaJogadores: p.capacidadeMaximaJogadores || MAX_ATTACK_PLAYERS
        }));
      setPartidas(formattedPartidas);
      console.log('Partidas carregadas do backend!');
    } catch (err) {
      console.error('Erro ao buscar partidas:', err);
      toast.error('Falha ao carregar partidas do backend. Recarregue a página.');
      setPartidas([]);
    } finally {
      setIsLoadingPartidas(false);
    }
  }, []);

  const updatePartidaName = async (partidaId: number, newName: string) => {
    try {
      const updatedPartida = await ritoApi.updatePartidaName(partidaId, newName);
      setPartidas(prev => prev.map(p => p.id === partidaId ? updatedPartida : p));
      toast.success(`Nome da partida "${updatedPartida.nome}" atualizado!`);
    } catch (error) {
      console.error('Erro ao atualizar nome da partida:', error);
      const errorMessage = (error as any).response?.data?.message || 'Erro desconhecido.';
      toast.error(`Falha ao atualizar nome da partida: ${errorMessage}`);
    }
  };

  // Outras funções de manipulação de partidas podem ser adicionadas aqui

  return {
    partidas,
    setPartidas,
    isLoadingPartidas,
    fetchPartidas,
    updatePartidaName,
  };
} 