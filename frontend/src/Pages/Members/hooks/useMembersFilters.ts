import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import membrosApi from '../../../Services/membrosApi';
import { Player } from '../../../Types/Rank.types';

export function useMembersFilters() {
  console.log('🔄 Hook useMembersFilters executado');
  
  const [filter, setFilter] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterCla, setFilterCla] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]); // Lista completa
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Estabilizar as funções setter com useCallback
  const stableSetFilter = useCallback((value: string) => {
    console.log('🎯 setFilter chamado com:', value);
    setFilter(value);
  }, []);

  const stableSetFilterClass = useCallback((value: string) => {
    console.log('🎯 setFilterClass chamado com:', value);
    setFilterClass(value);
  }, []);

  const stableSetFilterCla = useCallback((value: string) => {
    console.log('🎯 setFilterCla chamado com:', value);
    setFilterCla(value);
  }, []);

  // Carregar todos os membros uma vez na inicialização
  const loadAllPlayers = useCallback(async () => {
    console.log('🚀 loadAllPlayers chamado - timestamp:', Date.now());
    setIsLoading(true);
    try {
      console.log('🚀 Carregando todos os membros do backend');
      const data = await membrosApi.getMembros();
      setAllPlayers(data);
      console.log('✅ Carregados', data.length, 'membros');
    } catch (err: any) {
      console.error('❌ Erro ao carregar membros:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar membros.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // NOVO: Função para atualizar lista local após edições/remoções
  const refreshLocalData = useCallback(async () => {
    try {
      console.log('🔄 Atualizando dados locais após mudança');
      const data = await membrosApi.getMembros();
      setAllPlayers(data);
      console.log('✅ Dados locais atualizados');
    } catch (err: any) {
      console.error('❌ Erro ao atualizar dados locais:', err);
      setError(err?.response?.data?.message || 'Erro ao atualizar dados.');
    }
  }, []);

  // NOVO: Busca local com useMemo (como Rito/Vigília)
  const filteredPlayers = useMemo(() => {
    console.log('🔍 Filtrando localmente:', { filter, filterClass, filterCla });
    console.log('📊 Total de membros na lista:', allPlayers.length);
    
    let filtered = [...allPlayers];

    // Filtro por nome
    if (filter) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Filtro por classe
    if (filterClass) {
      filtered = filtered.filter(player =>
        player.memberClass.toLowerCase() === filterClass.toLowerCase()
      );
    }

    // Filtro por clã
    if (filterCla) {
      filtered = filtered.filter(player =>
        player.cla.toLowerCase() === filterCla.toLowerCase()
      );
    }

    console.log('✅ Filtro local retornou', filtered.length, 'membros');
    return filtered;
  }, [allPlayers, filter, filterClass, filterCla]);

  // Carregar todos os membros na inicialização
  useEffect(() => {
    console.log('🔄 useEffect: carregando membros na inicialização - timestamp:', Date.now());
    loadAllPlayers();
  }, []); // Removido loadAllPlayers da dependência

  return {
    filter, setFilter: stableSetFilter,
    filterClass, setFilterClass: stableSetFilterClass,
    filterCla, setFilterCla: stableSetFilterCla,
    players: filteredPlayers, // NOVO: Usar resultado do filtro local
    error,
    fetchPlayers: refreshLocalData, // NOVO: Usar refreshLocalData em vez de loadAllPlayers
    isLoading
  };
} 