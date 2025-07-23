import { useMemo } from 'react';
import { Player, Partida } from '../../../Types/Rank.types';
import { normalizeString } from '../../../Utils/normalizeString';

export function useAvailablePlayers(
  allPlayers: Player[],
  partidas: Partida[],
  searchTerm: string
) {
  return useMemo(() => {
    const playersInPartidas = new Set<number>();
    partidas.forEach(partida => {
      partida.membros.forEach(membro => playersInPartidas.add(membro.id));
    });

    let filtered = allPlayers.filter(player => !playersInPartidas.has(player.id));

    if (searchTerm) {
      filtered = filtered.filter(player =>
        normalizeString(player.name).includes(normalizeString(searchTerm))
      );
    }
    return filtered;
  }, [allPlayers, partidas, searchTerm]);
} 