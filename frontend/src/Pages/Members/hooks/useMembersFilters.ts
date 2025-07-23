import { useState, useCallback, useRef } from 'react';
import membrosApi from '../../../Services/membrosApi';
import { Player } from '../../../Types/Rank.types';

export function useMembersFilters() {
  const [filter, setFilter] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterCla, setFilterCla] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPlayers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await membrosApi.getMembros({
        name: filter,
        memberClass: filterClass,
        cla: filterCla
      }, controller.signal);
      setPlayers(data);
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err?.response?.data?.message || 'Erro ao buscar membros.');
        setPlayers([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter, filterClass, filterCla]);

  return {
    filter, setFilter,
    filterClass, setFilterClass,
    filterCla, setFilterCla,
    isLoading,
    players,
    error,
    fetchPlayers
  };
} 