import { useMemo } from 'react';
import { normalizeString } from '../../../Utils/normalizeString';
export function useAvailablePlayers(allPlayers, partidas, searchTerm) {
    return useMemo(() => {
        const playersInPartidas = new Set();
        partidas.forEach(partida => {
            partida.membros.forEach(membro => playersInPartidas.add(membro.id));
        });
        let filtered = allPlayers.filter(player => !playersInPartidas.has(player.id));
        if (searchTerm) {
            filtered = filtered.filter(player => normalizeString(player.name).includes(normalizeString(searchTerm)));
        }
        return filtered;
    }, [allPlayers, partidas, searchTerm]);
}
