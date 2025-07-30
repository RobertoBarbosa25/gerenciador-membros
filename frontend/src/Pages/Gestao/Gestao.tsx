import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Snackbar,
    Alert,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Divider,
    Checkbox,
    Switch,
    FormControlLabel,
    Tabs,
    Tab,
    Badge,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
    CircularProgress,
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Undo as UndoIcon,
    Redo as RedoIcon,
    SelectAll as SelectAllIcon,
    Clear as ClearIcon,
    History as HistoryIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Timeline as TimelineIcon,
    Group as GroupIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { Player } from '../../Types/Rank';
import { PageWrapper } from '../../Components/PageWrapper';
import membrosApi from '../../Services/membrosApi';
import gestaoVigiliaApi from '../../Services/gestaoVigiliaApi';
import cicloApi, { Ciclo, CicloVigilia } from '../../Services/cicloApi';
import { batchApi } from '../../Services/batchApi';

interface GestaoVigilia {
  id: number;
  nome: string;
}
interface GestaoPresenca {
  id: number;
  membro: Player;
  gestaoVigilia: GestaoVigilia;
  status?: 'presente' | 'faltou' | '';
  escalado: boolean;
}

type PendingPresenca = { status?: 'presente' | 'faltou' | ''; escalado: boolean };

// Tipos para funcionalidades avançadas
interface ActionHistory {
  id: string;
  action: string;
  membroId?: number;
  membroName?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}

type ThemeMode = 'light' | 'dark';

export const Gestao = () => {
  const [vigilias, setVigilias] = useState<GestaoVigilia[]>([]);
  const [currentVigilId, setCurrentVigilId] = useState<number>(0);
  const [membros, setMembros] = useState<Player[]>([]);
  const [presencas, setPresencas] = useState<GestaoPresenca[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingPresencas, setPendingPresencas] = useState<Record<number, PendingPresenca>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });
  
  // Estados para melhorias
  const [showCreateVigiliaDialog, setShowCreateVigiliaDialog] = useState(false);
  const [newVigiliaName, setNewVigiliaName] = useState('');
  const [showDeleteVigiliaDialog, setShowDeleteVigiliaDialog] = useState(false);
  const [vigiliaToDelete, setVigiliaToDelete] = useState<GestaoVigilia | null>(null);


  // Estados para funcionalidades avançadas

  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showCycleDialog, setShowCycleDialog] = useState(false);
  const [cycles, setCycles] = useState<Ciclo[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Ciclo | null>(null);
  const [newCycleName, setNewCycleName] = useState('');
  const [selectedVigiliasForCycle, setSelectedVigiliasForCycle] = useState<number[]>([]);
  const [showDeleteCycleDialog, setShowDeleteCycleDialog] = useState(false);
  const [cycleToDelete, setCycleToDelete] = useState<Ciclo | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const [membrosEscalados, setMembrosEscalados] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'escalados' | 'todos'>('escalados');
  
  // Estados para visualização de histórico
  const [showHistoryViewDialog, setShowHistoryViewDialog] = useState(false);
  const [selectedCycleForHistory, setSelectedCycleForHistory] = useState<Ciclo | null>(null);
  const [cycleHistoryData, setCycleHistoryData] = useState<any>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Carregar tema do localStorage e limpar estado inicial
  useEffect(() => {
    const savedTheme = localStorage.getItem('gestao-theme') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
    
    // Limpar alterações pendentes ao montar o componente
    setPendingPresencas({});
  }, []);

  // Controle para evitar carregamento duplicado
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Buscar vigilias, membros e ciclos ao carregar usando batch request
  useEffect(() => {
    // Evitar carregamento duplicado
    if (initialDataLoaded) return;
    
    // Limpar alterações pendentes ao carregar a página
    setPendingPresencas({});
    
    // Por enquanto, usar requests individuais otimizados
    // O batch request será ativado quando o servidor estiver pronto
    console.log('🔄 Carregando dados iniciais...');
    
    // Carregar dados em paralelo para melhor performance
    Promise.all([
      gestaoVigiliaApi.getVigilias(),
      gestaoVigiliaApi.getMembrosEscalados(),
      cicloApi.getCiclos(),
      cicloApi.getCicloAtivo(),
      membrosApi.getMembros()
    ])
    .then(([vigiliasData, membrosEscaladosData, ciclosData, cicloAtivoData, membrosData]) => {
      console.log('✅ Todos os dados carregados com sucesso!');
      
      setVigilias(vigiliasData);
      setMembrosEscalados(membrosEscaladosData);
      setCycles(ciclosData);
      setMembros(membrosData);
      
      // Definir primeira vigília se houver
      if (vigiliasData.length > 0 && !currentVigilId) {
        setCurrentVigilId(vigiliasData[0].id);
      }
      
      // Definir ciclo ativo se houver
      if (cicloAtivoData) {
        setCurrentCycle(cicloAtivoData);
      }
      
      setInitialDataLoaded(true);
    })
    .catch((error) => {
      console.error('Erro ao carregar dados:', error);
      setSnackbar({ 
        open: true, 
        message: 'Erro ao carregar dados iniciais', 
        severity: 'error' 
      });
    });
    
    // TODO: Ativar batch request quando servidor estiver pronto
    // batchApi.teste()
    //   .then((resultado) => {
    //     console.log('✅ Teste do batch controller:', resultado);
    //     return batchApi.getDadosIniciais();
    //   })
    //   .then((dadosCompletos) => {
    //     console.log('🚀 Batch request executado com sucesso!', dadosCompletos);
    //     // ... implementação do batch
    //   })
    //   .catch((error) => {
    //     console.log('Batch não disponível, usando requests individuais');
    //   });
  }, [initialDataLoaded]);

  // Buscar presenças ao trocar de vigília ou ciclo (otimizado para evitar duplicações)
  useEffect(() => {
    if (!currentVigilId || !currentCycle) return;
    
    console.log('🔄 Carregando presenças para vigília:', currentVigilId, 'ciclo:', currentCycle.id);
    setIsLoading(true);
    
    gestaoVigiliaApi.getPresencasPorCicloEVigilia(currentCycle.id, currentVigilId)
      .then((presencas) => {
        setPresencas(presencas);
        
        // Se estamos na aba de escalados, marcar membros escalados sem status como presentes
        // APENAS se não há alterações pendentes já E se não há dados salvos no banco
        if (activeTab === 'escalados' && membrosEscalados.length > 0 && Object.keys(pendingPresencas).length === 0) {
          const novasPresencas: Record<number, PendingPresenca> = {};
          
          membrosEscalados.forEach((membro: Player) => {
            // Procurar primeiro nas presenças salvas do banco, depois nas pendentes
            const presencaSalva = presencas.find((p: GestaoPresenca) => p.membro.id === membro.id);
            const presencaPendente = pendingPresencas[membro.id];
            const presencaExistente = presencaPendente || presencaSalva;
            
            // SÓ marcar como presente se:
            // 1. Não existe presença registrada no banco OU
            // 2. Existe presença mas não está escalado OU
            // 3. Existe presença, está escalado, mas não tem status definido
            // E NÃO marcar se já está correto (presente + escalado)
            if (!presencaExistente || 
                (presencaExistente && !presencaExistente.escalado) ||
                (presencaExistente && presencaExistente.escalado && !presencaExistente.status)) {
              
              // Só marcar se não está tentando marcar o mesmo valor que já existe
              const jaEstaCorreto = presencaExistente && 
                presencaExistente.escalado && 
                presencaExistente.status === 'presente';
              
              if (!jaEstaCorreto) {
                novasPresencas[membro.id] = { status: 'presente' as const, escalado: true };
              }
            }
          });
          
          if (Object.keys(novasPresencas).length > 0) {
            setPendingPresencas(novasPresencas);
          }
        }
        
        // IMPORTANTE: NÃO desescalar membros que já têm dados salvos!
        // Se um membro foi removido da vigília mas já tem presença/falta salva,
        // deve manter os dados para preservar o histórico
        if (membrosEscalados.length > 0) {
          const membrosEscaladosIds = new Set(membrosEscalados.map((m: Player) => m.id));
          const novasPresencas = { ...pendingPresencas };
          
          presencas.forEach((presenca: GestaoPresenca) => {
            if (presenca.escalado && !membrosEscaladosIds.has(presenca.membro.id)) {
              // Membro está escalado no banco mas não está mais escalado nas salas
              // SÓ desescalar se não tem dados salvos (status vazio)
              if (!presenca.status) {
                console.log(`🔍 Debug - Desescalando membro ${presenca.membro.name} (sem dados salvos) - useEffect membros escalados`);
                novasPresencas[presenca.membro.id] = { status: '', escalado: false };
              } else {
                console.log(`🔍 Debug - PRESERVANDO dados do membro ${presenca.membro.name} (${presenca.status}) - já foi salvo! - useEffect membros escalados`);
              }
            }
          });
          
          if (Object.keys(novasPresencas).length !== Object.keys(pendingPresencas).length) {
            setPendingPresencas(novasPresencas);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentVigilId, currentCycle]); // Removido activeTab e membrosEscalados das dependências para evitar re-execuções desnecessárias

  // Recarregar membros escalados quando necessário (otimizado para evitar chamadas desnecessárias)
  useEffect(() => {
    // Só recarregar se realmente necessário (vigílias mudaram ou mudou de aba)
    if (vigilias.length === 0 || !initialDataLoaded) return;
    
    console.log('🔄 Recarregando membros escalados...');
    gestaoVigiliaApi.getMembrosEscalados().then((membros) => {
      setMembrosEscalados(membros);
      
      // Se estamos na aba de escalados e há membros escalados, marcar como presentes
      // APENAS se as presenças já foram carregadas do banco
      if (activeTab === 'escalados' && currentCycle && currentVigilId && membros.length > 0 && presencas.length > 0) {

        const novasPresencas: Record<number, PendingPresenca> = {};
        
        membros.forEach((membro: Player) => {
          // Procurar primeiro nas presenças salvas do banco, depois nas pendentes
          const presencaSalva = presencas.find((p: GestaoPresenca) => p.membro.id === membro.id);
          const presencaPendente = pendingPresencas[membro.id];
          const presencaExistente = presencaPendente || presencaSalva;
          
          // Verificar se o membro foi recém-escalado (não está nas presenças salvas)
          const membroRecemEscalado = !presencaSalva;
          
          // SÓ marcar como presente se:
          // 1. Não existe presença OU
          // 2. Existe presença mas não está escalado OU
          // 3. Existe presença, está escalado, mas não tem status definido
          // 4. Membro foi recém-escalado (não está nas presenças salvas)
          // E NÃO marcar se já está correto (presente + escalado)
          if (!presencaExistente || 
              (presencaExistente && !presencaExistente.escalado) ||
              (presencaExistente && presencaExistente.escalado && !presencaExistente.status) ||
              membroRecemEscalado) {
            
            // Só marcar se não está tentando marcar o mesmo valor que já existe
            const jaEstaCorreto = presencaExistente && 
              presencaExistente.escalado && 
              presencaExistente.status === 'presente';
            
            if (!jaEstaCorreto) {
              console.log(`🎯 Marcando membro recém-escalado como presente: ${membro.name}`);
              novasPresencas[membro.id] = { status: 'presente' as const, escalado: true };
            }
          }
        });
        
        if (Object.keys(novasPresencas).length > 0) {
          console.log(`📝 Adicionando ${Object.keys(novasPresencas).length} membros recém-escalados como presentes`);
          setPendingPresencas(prev => ({ ...prev, ...novasPresencas }));
        }
        
        // Adicionar membros escalados que não estão nas presenças (recém-escalados)
        const membrosEscaladosIds = new Set(membros.map((m: Player) => m.id));
        const presencasSalvasIds = new Set(presencas.map((p: GestaoPresenca) => p.membro.id));
        const membrosRecemEscalados = membros.filter((m: Player) => 
          membrosEscaladosIds.has(m.id) && !presencasSalvasIds.has(m.id)
        );
        
        if (membrosRecemEscalados.length > 0) {
          console.log(`🆕 Detectados ${membrosRecemEscalados.length} membros recém-escalados:`, 
            membrosRecemEscalados.map(m => m.name));
          
          const presencasRecemEscalados: Record<number, PendingPresenca> = {};
          membrosRecemEscalados.forEach((membro: Player) => {
            presencasRecemEscalados[membro.id] = { status: 'presente' as const, escalado: true };
          });
          
          setPendingPresencas(prev => ({ ...prev, ...presencasRecemEscalados }));
        }
      }
      
      // Limpar membros que não estão mais escalados das alterações pendentes
      if (Object.keys(pendingPresencas).length > 0) {
        const membrosEscaladosIds = new Set(membros.map((m: Player) => m.id));
        const novasPresencas = { ...pendingPresencas };
        
        Object.keys(novasPresencas).forEach(membroIdStr => {
          const membroId = Number(membroIdStr);
          if (!membrosEscaladosIds.has(membroId)) {
            delete novasPresencas[membroId];
          }
        });
        
        if (Object.keys(novasPresencas).length !== Object.keys(pendingPresencas).length) {
          setPendingPresencas(novasPresencas);
        }
      }
      
      // IMPORTANTE: NÃO desescalar membros que já têm dados salvos!
      // Se um membro foi removido da vigília mas já tem presença/falta salva,
      // deve manter os dados para preservar o histórico
      if (currentCycle && currentVigilId) {
        const membrosEscaladosIds = new Set(membros.map((m: Player) => m.id));
        const novasPresencas = { ...pendingPresencas };
        
        presencas.forEach(presenca => {
          if (presenca.escalado && !membrosEscaladosIds.has(presenca.membro.id)) {
            // Membro está escalado no banco mas não está mais escalado nas salas
            // SÓ desescalar se não tem dados salvos (status vazio)
            if (!presenca.status) {
              console.log(`🔍 Debug - Desescalando membro ${presenca.membro.name} (sem dados salvos)`);
              novasPresencas[presenca.membro.id] = { status: '', escalado: false };
            } else {
              console.log(`🔍 Debug - PRESERVANDO dados do membro ${presenca.membro.name} (${presenca.status}) - já foi salvo!`);
            }
          }
        });
        
        if (Object.keys(novasPresencas).length !== Object.keys(pendingPresencas).length) {
          setPendingPresencas(novasPresencas);
        }
      }
    }).catch((error) => {
      console.error('Erro ao carregar membros escalados:', error);
      setMembrosEscalados([]);
    });
  }, [vigilias, activeTab]); // Removido currentCycle e currentVigilId das dependências para evitar chamadas desnecessárias

  // Mapear presenças por membroId
  const presencaMap: Record<number, GestaoPresenca> = {};
  presencas.forEach((p) => {
    presencaMap[p.membro.id] = p;
  });

  // Filtrar membros pelo nome
  const filteredMembros = membros.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Contar faltas e presenças (ciclo atual, apenas escalados e status válido)
  const [historico, setHistorico] = useState<Record<number, { faltas: number; presencas: number }>>({});
  const [historicoLoading, setHistoricoLoading] = useState(false);
  
  useEffect(() => {
    if (!currentCycle) {
      setHistorico({});
      return;
    }
    
    // Evitar chamadas duplicadas
    if (historicoLoading) {
      return;
    }
    
    // Para ciclos novos, não carregar histórico (não há dados ainda)
    if (currentCycle.dataInicio && new Date(currentCycle.dataInicio).getTime() > Date.now() - 60000) {
      console.log('🆕 Ciclo novo detectado, pulando carregamento de histórico');
      setHistorico({});
      return;
    }
    
    // Otimização: usar batch request quando disponível, senão usar requests individuais
    const carregarHistorico = async () => {
      setHistoricoLoading(true);
      try {
        console.log('🔄 Carregando histórico para ciclo:', currentCycle.id);
        
        // Tentar usar batch request primeiro
        const dadosBatch = await batchApi.getPresencasCiclo(currentCycle.id);
        
        if (dadosBatch.presencas && dadosBatch.presencas.length > 0) {
          console.log('🚀 Histórico carregado via batch request!');
          
          const hist: Record<number, { faltas: number; presencas: number }> = {};
          membros.forEach((m) => {
            const presencasMembro = dadosBatch.presencas.filter((p: GestaoPresenca) => 
              p.membro.id === m.id && p.escalado
            );
            
            hist[m.id] = {
              faltas: presencasMembro.filter((p: GestaoPresenca) => p.status === 'faltou').length,
              presencas: presencasMembro.filter((p: GestaoPresenca) => p.status === 'presente').length,
            };
          });
          
          setHistorico(hist);
        } else {
          // Fallback para requests individuais
          console.log('📋 Usando requests individuais para histórico...');
          
          const results = await Promise.all(
            membros.map((m) =>
              gestaoVigiliaApi.getPresencasPorCicloEMembro(currentCycle.id, m.id)
                .then((list: GestaoPresenca[]) => ({
                  id: m.id,
                  faltas: list.filter((p) => p.escalado && p.status === 'faltou').length,
                  presencas: list.filter((p) => p.escalado && p.status === 'presente').length,
                }))
                .catch((error) => {
                  console.error(`Erro ao buscar presenças do membro ${m.id}:`, error);
                  return {
                    id: m.id,
                    faltas: 0,
                    presencas: 0,
                  };
                })
            )
          );
          
          const hist: Record<number, { faltas: number; presencas: number }> = {};
          results.forEach((r) => {
            hist[r.id] = { faltas: r.faltas, presencas: r.presencas };
          });
          setHistorico(hist);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setHistorico({});
      } finally {
        setHistoricoLoading(false);
      }
    };
    
    carregarHistorico();
  }, [membros, currentCycle]); // Removido 'presencas' das dependências

  // Marcar presença/falta/escalado (apenas local, para salvar depois)
  const marcarPresenca = (membroId: number, status: 'presente' | 'faltou') => {
    setPendingPresencas((prev) => ({
      ...prev,
      [membroId]: { status, escalado: true },
    }));
  };
  // Desescalar: limpa status, só muda escalado para false
  const desescalar = (membroId: number) => {
    setPendingPresencas((prev) => ({
      ...prev,
      [membroId]: { status: '', escalado: false },
    }));
  };

  // Escalar: marca como presente e escalado
  const escalar = (membroId: number) => {
    setPendingPresencas((prev) => ({
      ...prev,
      [membroId]: { status: 'presente', escalado: true },
    }));
  };

  // Salvar todas as alterações pendentes
  const handleSalvar = async () => {
    if (!currentVigilId || !currentCycle) return;
    setIsSaving(true);
    try {
      // Preparar dados para salvamento em lote
      const presencasParaSalvar = Object.entries(pendingPresencas).map(([membroId, { status, escalado }]) => ({
        membroId: Number(membroId),
        gestaoVigiliaId: currentVigilId,
        cicloId: currentCycle.id,
        status: status || '',
        escalado,
      }));

      console.log('🚀 Salvando', presencasParaSalvar.length, 'presenças em lote...');
      
      // Usar batch request para salvar todas as presenças de uma vez
      await batchApi.salvarPresencasEmLote(presencasParaSalvar);
      // Atualizar presenças locais com as alterações salvas
      const presencasAtualizadas = [...presencas];
      
      Object.entries(pendingPresencas).forEach(([membroId, { status, escalado }]) => {
        const membroIdNum = Number(membroId);
        const index = presencasAtualizadas.findIndex(p => p.membro.id === membroIdNum);
        
        if (index >= 0) {
          // Atualizar presença existente
          presencasAtualizadas[index] = {
            ...presencasAtualizadas[index],
            status: status || '',
            escalado
          };
        } else {
          // Adicionar nova presença (para membros recém-escalados)
          const membro = membros.find((m: Player) => m.id === membroIdNum);
          if (membro) {
            presencasAtualizadas.push({
              id: Date.now(), // ID temporário
              membro,
              gestaoVigilia: vigilias.find(v => v.id === currentVigilId)!,
              status: status || '',
              escalado
            });
          }
        }
      });
      
      setPresencas(presencasAtualizadas);
      setPendingPresencas({});
      setSnackbar({ open: true, message: 'Alterações salvas com sucesso!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Erro ao salvar alterações!', severity: 'error' });
    }
    setIsSaving(false);
  };

  // Corrigir select: sempre valor válido
  const handleVigilChange = (e: any) => {
    const value = Number(e.target.value);
    setCurrentVigilId(value);
  };

  // Funções para gerenciar vigílias
  const handleCreateVigilia = async () => {
    if (!newVigiliaName.trim()) return;
    try {
      await gestaoVigiliaApi.createVigilia(newVigiliaName.trim());
      const novasVigilias = await gestaoVigiliaApi.getVigilias();
      setVigilias(novasVigilias);
      setNewVigiliaName('');
      setShowCreateVigiliaDialog(false);
      setSnackbar({ open: true, message: 'Vigília criada com sucesso!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Erro ao criar vigília!', severity: 'error' });
    }
  };

  const handleDeleteVigilia = async () => {
    if (!vigiliaToDelete) return;
    try {
      await gestaoVigiliaApi.deleteVigilia(vigiliaToDelete.id);
      const novasVigilias = await gestaoVigiliaApi.getVigilias();
      setVigilias(novasVigilias);
      if (currentVigilId === vigiliaToDelete.id && novasVigilias.length > 0) {
        setCurrentVigilId(novasVigilias[0].id);
      }
      setVigiliaToDelete(null);
      setShowDeleteVigiliaDialog(false);
      setSnackbar({ open: true, message: 'Vigília deletada com sucesso!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Erro ao deletar vigília!', severity: 'error' });
    }
  };

  // Filtrar membros por status
  const getFilteredMembros = () => {
    // Determinar qual lista usar baseado na aba ativa
    let membrosBase: Player[];
    
    if (activeTab === 'escalados') {
      // Aba de escalados: mostrar apenas membros escalados
      membrosBase = membrosEscalados;
    } else {
      // Aba de todos: mostrar todos os membros
      membrosBase = membros;
    }
    
    let filtered = membrosBase.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return filtered;
  };

  // Estatísticas da vigília atual
  const getVigiliaStats = () => {
    const escalados = presencas.filter(p => p.escalado).length;
    const presentes = presencas.filter(p => p.escalado && p.status === 'presente').length;
    const faltaram = presencas.filter(p => p.escalado && p.status === 'faltou').length;
    const totalMembros = activeTab === 'escalados' ? membrosEscalados.length : membros.length;
    
    return { escalados, presentes, faltaram, totalMembros };
  };

  // ===== FUNCIONALIDADES AVANÇADAS =====

  // 1. UNDO/REDO SYSTEM
  const addToHistory = useCallback((action: Omit<ActionHistory, 'id' | 'timestamp'>) => {
    const newAction: ActionHistory = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setActionHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), newAction];
      setHistoryIndex(newHistory.length - 1);
      return newHistory.slice(-20); // Manter apenas últimas 20 ações
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      // Aqui você implementaria a lógica de desfazer
      setSnackbar({ open: true, message: 'Ação desfeita!', severity: 'info' });
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < actionHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      // Aqui você implementaria a lógica de refazer
      setSnackbar({ open: true, message: 'Ação refeita!', severity: 'info' });
    }
  }, [historyIndex, actionHistory.length]);



  // 3. CYCLE MANAGEMENT
  const createCycle = async () => {
    if (!newCycleName.trim() || selectedVigiliasForCycle.length === 0) {
      setSnackbar({ open: true, message: 'Preencha o nome e selecione as vigílias!', severity: 'warning' });
      return;
    }
    
    try {
      const newCycle = await cicloApi.createCiclo(newCycleName.trim(), selectedVigiliasForCycle);
      
      // Recarregar todos os ciclos para garantir sincronização
      const todosCiclos = await cicloApi.getCiclos();
      const cicloAtivo = await cicloApi.getCicloAtivo();
      
      setCycles(Array.isArray(todosCiclos) ? todosCiclos : []);
      setCurrentCycle(cicloAtivo);
      
      // Limpar presenças pendentes e histórico ao criar novo ciclo
      setPendingPresencas({});
      setPresencas([]);
      setHistorico({});
      
      setNewCycleName('');
      setSelectedVigiliasForCycle([]);
      setSnackbar({ open: true, message: `Ciclo "${newCycle.nome}" criado e ativado!`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao criar ciclo!', severity: 'error' });
    }
  };

  const deleteCycle = async () => {
    if (!cycleToDelete) return;
    
    try {
      await cicloApi.deleteCiclo(cycleToDelete.id);
      setCycles(prev => prev.filter(c => c.id !== cycleToDelete.id));
      if (currentCycle?.id === cycleToDelete.id) {
        setCurrentCycle(null);
      }
      setCycleToDelete(null);
      setShowDeleteCycleDialog(false);
      setSnackbar({ open: true, message: 'Ciclo deletado com sucesso!', severity: 'success' });
    } catch (error: any) {
      console.error('Erro ao deletar ciclo:', error);
      const errorMessage = error.response?.data || 'Erro ao deletar ciclo!';
      setSnackbar({ 
        open: true, 
        message: typeof errorMessage === 'string' ? errorMessage : 'Erro ao deletar ciclo!', 
        severity: 'error' 
      });
    }
  };

  const handleVigiliaSelectionForCycle = (vigiliaId: number) => {
    setSelectedVigiliasForCycle(prev => {
      if (prev.includes(vigiliaId)) {
        return prev.filter(id => id !== vigiliaId);
      } else {
        if (prev.length >= 3) {
          setSnackbar({ open: true, message: 'Máximo de 3 vigílias por ciclo!', severity: 'warning' });
          return prev;
        }
        return [...prev, vigiliaId];
      }
    });
  };

  // Função para visualizar histórico de um ciclo
  const viewCycleHistory = async (cycle: Ciclo) => {
    setSelectedCycleForHistory(cycle);
    setShowHistoryViewDialog(true);
    setIsLoadingHistory(true);
    
    try {
      const historyData = await gestaoVigiliaApi.getHistoricoCompletoDoCiclo(cycle.id);
      setCycleHistoryData(historyData);
    } catch (error: any) {
      console.error('Erro ao carregar histórico do ciclo:', error);
      setSnackbar({ 
        open: true, 
        message: `Erro ao carregar histórico do ciclo: ${error.response?.status || 'Erro desconhecido'}`, 
        severity: 'error' 
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };



  // Função para exportar histórico do ciclo em CSV
  const exportCycleHistoryToCSV = (cycleData: any, cycleName: string) => {
    if (!cycleData || !cycleData.estatisticasPorJogador) {
      setSnackbar({ 
        open: true, 
        message: 'Nenhum dado disponível para exportar', 
        severity: 'warning' 
      });
      return;
    }

    // Cabeçalho do CSV
    const csvHeader = [
      'Jogador',
      'Classe', 
      'Total Escalações',
      'Presentes',
      'Faltaram',
      '% Presença'
    ].join(',');

    // Dados dos jogadores
    const csvRows = cycleData.estatisticasPorJogador.map((jogador: any) => [
      `"${jogador.membroNome || 'N/A'}"`,
      `"${jogador.membroClasse || 'N/A'}"`,
      jogador.totalEscalacoes || 0,
      jogador.presentes || 0,
      jogador.faltaram || 0,
      `${jogador.percentualPresenca || 0}%`
    ].join(','));

    // Estatísticas gerais
    const stats = cycleData.estatisticasGerais;
    const csvStatsRow1 = [
      'TOTAL GERAL',
      '',
      stats?.totalEscalacoes || 0,
      stats?.totalPresentes || 0,
      stats?.totalFaltaram || 0,
      `${stats?.percentualGeralPresenca || 0}%`
    ].join(',');

    // Combinar tudo
    const csvContent = [
      `Histórico do Ciclo: ${cycleName}`,
      `Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}`,
      '',
      csvHeader,
      ...csvRows,
      '',
      csvStatsRow1
    ].join('\n');

    // Criar e baixar o arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historico_ciclo_${cycleName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({ 
      open: true, 
      message: `Histórico do ciclo "${cycleName}" exportado com sucesso!`, 
      severity: 'success' 
    });
  };

  // 4. THEME TOGGLE
  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    localStorage.setItem('gestao-theme', newTheme);
  };

  // Função para lidar com a mudança de aba
  const handleTabChange = (newTab: 'escalados' | 'todos') => {
    setActiveTab(newTab);
    
    // Se mudou para aba de escalados, inicializar membros escalados como presentes
    // APENAS se não há alterações pendentes já
    if (newTab === 'escalados' && currentCycle && currentVigilId && Object.keys(pendingPresencas).length === 0) {
      if (membrosEscalados.length === 0) {
        setSnackbar({ 
          open: true, 
          message: 'Nenhum membro está escalado nas salas da vigília!', 
          severity: 'warning' 
        });
        return;
      }
      
      const novasPresencas: Record<number, PendingPresenca> = {};
      
      membrosEscalados.forEach(membro => {
        // Verificar se já existe uma presença para este membro
        // Procurar primeiro nas presenças salvas do banco, depois nas pendentes
        const presencaSalva = presencas.find((p: GestaoPresenca) => p.membro.id === membro.id);
        const presencaPendente = pendingPresencas[membro.id];
        const presencaExistente = presencaPendente || presencaSalva;
        
        // SÓ marcar como presente se:
        // 1. Não existe presença OU
        // 2. Existe presença mas não está escalado OU
        // 3. Existe presença, está escalado, mas não tem status definido
        // E NÃO marcar se já está correto (presente + escalado)
        if (!presencaExistente || 
            (presencaExistente && !presencaExistente.escalado) ||
            (presencaExistente && presencaExistente.escalado && !presencaExistente.status)) {
          
          // Só marcar se não está tentando marcar o mesmo valor que já existe
          const jaEstaCorreto = presencaExistente && 
            presencaExistente.escalado && 
            presencaExistente.status === 'presente';
          
          if (!jaEstaCorreto) {
            novasPresencas[membro.id] = { status: 'presente' as const, escalado: true };
          }
        }
      });
      
      if (Object.keys(novasPresencas).length > 0) {
        setPendingPresencas(prev => ({ ...prev, ...novasPresencas }));
        setSnackbar({ 
          open: true, 
          message: `${Object.keys(novasPresencas).length} membros escalados marcados como presentes automaticamente!`, 
          severity: 'info' 
        });
      }
    }
  };



  // Atalhos de teclado para Undo/Redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            undo();
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <PageWrapper>
      <Box 
        component={Paper} 
        p={3} 
        width="100%" 
        height="100%" 
        overflow="auto" 
        sx={{ 
          backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          color: themeMode === 'dark' ? 'white' : 'black'
        }}
      >
        {/* Header com título e ações */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ 
              color: themeMode === 'dark' ? 'white' : 'black', 
              fontWeight: 'bold' 
            }}>
              🎯 Gestão de Escala e Presença
            </Typography>
            {currentCycle && (
              <Typography variant="body2" sx={{ 
                color: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', 
                marginTop: 0.5 
              }}>
                📊 Ciclo Ativo: {currentCycle.nome}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Funcionalidades Avançadas */}
            <Tooltip title="Desfazer (Ctrl+Z)">
              <span>
                <IconButton 
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  sx={{ 
                    color: themeMode === 'dark' ? 'white' : 'black', 
                    backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                  }}
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Refazer (Ctrl+Y)">
              <span>
                <IconButton 
                  onClick={redo}
                  disabled={historyIndex >= actionHistory.length - 1}
                  sx={{ 
                    color: themeMode === 'dark' ? 'white' : 'black', 
                    backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                  }}
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Histórico de ações">
              <IconButton 
                onClick={() => setShowHistoryDialog(true)}
                sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                }}
              >
                <Badge badgeContent={actionHistory.length} color="error">
                  <HistoryIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Gerenciar ciclos">
              <IconButton 
                onClick={() => setShowCycleDialog(true)}
                sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                }}
              >
                <TimelineIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Alternar para modo ${themeMode === 'dark' ? 'claro' : 'escuro'}`}>
              <IconButton 
                onClick={toggleTheme}
                sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                }}
              >
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Criar nova vigília">
              <IconButton 
                onClick={() => setShowCreateVigiliaDialog(true)}
                sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Salvar alterações">
              <span>
                <IconButton 
                  onClick={handleSalvar}
                  disabled={isSaving || Object.keys(pendingPresencas).length === 0}
                  sx={{ 
                    color: themeMode === 'dark' ? 'white' : 'black', 
                    backgroundColor: Object.keys(pendingPresencas).length > 0 
                      ? 'rgba(76, 175, 80, 0.8)' 
                      : (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* Estatísticas da vigília atual */}
        {currentVigilId && (
          <Card sx={{ 
            marginBottom: 3, 
            backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
            color: themeMode === 'dark' ? 'white' : 'black' 
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                color: themeMode === 'dark' ? 'white' : 'black' 
              }}>
                📊 Estatísticas - {vigilias.find((v) => v.id === currentVigilId)?.nome}
              </Typography>
              <Grid container spacing={2}>
                {(() => {
                  const stats = getVigiliaStats();
                  return (
                    <>
                      <Grid item xs={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#4CAF50' }}>{stats.escalados}</Typography>
                          <Typography variant="body2" sx={{ color: themeMode === 'dark' ? 'white' : 'black' }}>Escalados</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#2196F3' }}>{stats.presentes}</Typography>
                          <Typography variant="body2" sx={{ color: themeMode === 'dark' ? 'white' : 'black' }}>Presentes</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#FF5722' }}>{stats.faltaram}</Typography>
                          <Typography variant="body2" sx={{ color: themeMode === 'dark' ? 'white' : 'black' }}>Faltaram</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#FFC107' }}>{stats.totalMembros}</Typography>
                          <Typography variant="body2" sx={{ color: themeMode === 'dark' ? 'white' : 'black' }}>Total Membros</Typography>
                        </Box>
                      </Grid>
                    </>
                  );
                })()}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Controles de filtro e pesquisa */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="🔍 Pesquisar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              width: '250px', 
              backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'white', 
              boxShadow: 1, 
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { 
                  borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' 
                },
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'gray', marginRight: 1 }} />
            }}
          />
          
          <FormControl sx={{ width: '200px' }}>
            <InputLabel id="vigil-select-label" sx={{ color: themeMode === 'dark' ? 'white' : 'black' }}>🎯 Vigília</InputLabel>
            <Select
              labelId="vigil-select-label"
              value={currentVigilId || ''}
              onChange={handleVigilChange}
              sx={{ 
                backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'white',
                color: themeMode === 'dark' ? 'black' : 'black'
              }}
            >
              {vigilias.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    {v.nome}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVigiliaToDelete(v);
                        setShowDeleteVigiliaDialog(true);
                      }}
                      sx={{ color: 'red' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>



          <Box sx={{ 
            backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1,
            padding: '4px',
            margin: 0
          }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => handleTabChange(newValue)}
              sx={{
                minHeight: 'auto',
                '& .MuiTab-root': {
                  minHeight: '32px',
                  fontSize: '0.875rem',
                  color: themeMode === 'dark' ? 'white' : 'black',
                  '&.Mui-selected': {
                    color: themeMode === 'dark' ? '#4CAF50' : '#4CAF50',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: themeMode === 'dark' ? '#4CAF50' : '#4CAF50',
                }
              }}
            >
              <Tab 
                label={`🎯 Escalados (${membrosEscalados.length})`} 
                value="escalados"
                sx={{ minWidth: 'auto', padding: '6px 12px' }}
              />
              <Tab 
                label={`📋 Todos (${membros.length})`} 
                value="todos"
                sx={{ minWidth: 'auto', padding: '6px 12px' }}
              />
            </Tabs>
          </Box>

          {/* Informações da aba ativa */}
          <Card sx={{ 
            marginBottom: 2, 
            backgroundColor: themeMode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)', 
            border: `1px solid ${themeMode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}` 
          }}>
            <CardContent sx={{ padding: '12px 16px' }}>
              <Typography variant="body2" sx={{ 
                color: themeMode === 'dark' ? 'white' : 'black',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {activeTab === 'escalados' ? (
                  <>
                    🎯 <strong>Modo Escalados:</strong> Mostrando apenas membros escalados nas salas da vigília. 
                    Você pode marcar presenças e faltas.
                  </>
                ) : (
                  <>
                    📋 <strong>Modo Todos:</strong> Visualizando todos os membros. 
                    Você pode escalar (+) ou desescalar (🗑️) membros manualmente.
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>

          {Object.keys(pendingPresencas).length > 0 && (
            <Chip 
              label={`${Object.keys(pendingPresencas).length} alterações pendentes`}
              color="warning"
              icon={<WarningIcon />}
                           onClick={() => {
               console.log('🔍 Debug - pendingPresencas:', pendingPresencas);
               console.log('🔍 Debug - Object.keys(pendingPresencas):', Object.keys(pendingPresencas));
               console.log('🔍 Debug - membrosEscalados:', membrosEscalados.map(m => ({ id: m.id, name: m.name })));
               console.log('🔍 Debug - presencas:', presencas.map(p => ({ membroId: p.membro.id, membroName: p.membro.name, escalado: p.escalado, status: p.status })));
               
               // Debug detalhado dos membros com alterações pendentes
               Object.keys(pendingPresencas).forEach(membroIdStr => {
                 const membroId = Number(membroIdStr);
                 const membroEscalado = membrosEscalados.find(m => m.id === membroId);
                 const presencaSalva = presencas.find(p => p.membro.id === membroId);
                 
                 console.log(`🔍 Debug - Membro ${membroId}:`, {
                   nome: membroEscalado?.name || 'N/A',
                   estaEscalado: !!membroEscalado,
                   presencaSalva: presencaSalva ? {
                     escalado: presencaSalva.escalado,
                     status: presencaSalva.status
                   } : 'NÃO ENCONTRADA',
                   pendingPresenca: pendingPresencas[membroId],
                   presencaSalvaCompleta: presencaSalva,
                   pendingPresencaCompleta: pendingPresencas[membroId]
                 });
                 
                 // Logs separados para forçar exibição completa
                 console.log(`🔍 Debug - Membro ${membroId} - Presença Salva:`, JSON.stringify(presencaSalva, null, 2));
                 console.log(`🔍 Debug - Membro ${membroId} - Pending Presença:`, JSON.stringify(pendingPresencas[membroId], null, 2));
               });
             }}
            />
          )}
        </Box>

        {/* Loading indicator */}
        {isLoading && <LinearProgress sx={{ marginBottom: 2 }} />}



        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  fontWeight: 'bold' 
                }}>Nome</TableCell>
                <TableCell sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  fontWeight: 'bold' 
                }}>Status</TableCell>
                <TableCell sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  fontWeight: 'bold' 
                }}>Faltas</TableCell>
                <TableCell sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  fontWeight: 'bold' 
                }}>Presenças</TableCell>
                <TableCell sx={{ 
                  color: themeMode === 'dark' ? 'white' : 'black', 
                  fontWeight: 'bold' 
                }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredMembros().map((membro) => {
                const presenca = pendingPresencas[membro.id] || presencaMap[membro.id];
                // Contabilizar faltas e presenças de TODAS as vigílias (histórico total)
                const faltas = historico[membro.id]?.faltas || 0;
                const presencasCount = historico[membro.id]?.presencas || 0;
                
                return (
                  <TableRow key={membro.id} sx={{ 
                    backgroundColor: presenca?.escalado 
                      ? (themeMode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)')
                      : 'transparent',
                    '&:hover': { 
                      backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' 
                    }
                  }}>

                    <TableCell sx={{ 
                      color: themeMode === 'dark' ? 'white' : 'black', 
                      fontWeight: 'bold' 
                    }}>{membro.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {presenca?.escalado ? (
                          <Chip 
                            label={presenca.status === 'presente' ? '✅ Presente' : presenca.status === 'faltou' ? '❌ Faltou' : '⏳ Pendente'}
                            color={presenca.status === 'presente' ? 'success' : presenca.status === 'faltou' ? 'error' : 'warning'}
                            size="small"
                          />
                        ) : (
                          <Chip label="Não escalado" color="default" size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#FF5722', fontWeight: 'bold' }}>
                        {faltas}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        {presencasCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {activeTab === 'escalados' ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Tooltip title="Marcar como presente">
                            <span>
                              <IconButton
                                onClick={() => marcarPresenca(membro.id, 'presente')}
                                disabled={isSaving || (presenca?.status === 'presente' && presenca?.escalado)}
                                sx={{ 
                                  color: 'white', 
                                  backgroundColor: presenca?.status === 'presente' ? '#4CAF50' : 'rgba(76, 175, 80, 0.3)',
                                  '&:hover': { backgroundColor: '#4CAF50' }
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          
                          <Tooltip title="Marcar como falta">
                            <span>
                              <IconButton
                                onClick={() => marcarPresenca(membro.id, 'faltou')}
                                disabled={isSaving || (presenca?.status === 'faltou' && presenca?.escalado)}
                                sx={{ 
                                  color: 'white', 
                                  backgroundColor: presenca?.status === 'faltou' ? '#FF5722' : 'rgba(255, 87, 34, 0.3)',
                                  '&:hover': { backgroundColor: '#FF5722' }
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          
                          <Tooltip title="Desescalar membro">
                            <span>
                              <IconButton
                                onClick={() => desescalar(membro.id)}
                                disabled={isSaving || !presenca?.escalado}
                                sx={{ 
                                  color: 'white', 
                                  backgroundColor: 'rgba(255, 193, 7, 0.3)',
                                  '&:hover': { backgroundColor: '#FFC107' }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {presenca?.escalado ? (
                            <Tooltip title="Desescalar membro">
                              <span>
                                <IconButton
                                  onClick={() => desescalar(membro.id)}
                                  disabled={isSaving}
                                  sx={{ 
                                    color: 'white', 
                                    backgroundColor: 'rgba(255, 193, 7, 0.3)',
                                    '&:hover': { backgroundColor: '#FFC107' }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Escalar membro">
                              <span>
                                <IconButton
                                  onClick={() => escalar(membro.id)}
                                  disabled={isSaving}
                                  sx={{ 
                                    color: 'white', 
                                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                                    '&:hover': { backgroundColor: '#4CAF50' }
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Dialog para criar nova vigília */}
        <Dialog open={showCreateVigiliaDialog} onClose={() => setShowCreateVigiliaDialog(false)}>
          <DialogTitle>➕ Criar Nova Vigília</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome da Vigília"
              fullWidth
              variant="outlined"
              value={newVigiliaName}
              onChange={(e) => setNewVigiliaName(e.target.value)}
              placeholder="Ex: Vigília 4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateVigilia()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateVigiliaDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateVigilia} variant="contained" color="primary">
              Criar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para confirmar exclusão de vigília */}
        <Dialog open={showDeleteVigiliaDialog} onClose={() => setShowDeleteVigiliaDialog(false)}>
          <DialogTitle>⚠️ Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir a vigília <strong>"{vigiliaToDelete?.nome}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Esta ação não pode ser desfeita e removerá todos os registros de presença desta vigília.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteVigiliaDialog(false)}>Cancelar</Button>
            <Button onClick={handleDeleteVigilia} variant="contained" color="error">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para Histórico de Ações */}
        <Dialog 
          open={showHistoryDialog} 
          onClose={() => setShowHistoryDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>📋 Histórico de Ações ({actionHistory.length})</DialogTitle>
          <DialogContent>
            {actionHistory.length === 0 ? (
              <Typography color="text.secondary">Nenhuma ação registrada ainda.</Typography>
            ) : (
              <List>
                {actionHistory.slice().reverse().map((action) => (
                  <ListItem key={action.id} divider>
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={action.action}
                      secondary={`${action.membroName || 'Sistema'} - ${action.timestamp.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHistoryDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

                {/* Dialog para Gerenciar Ciclos */}
        <Dialog 
          open={showCycleDialog} 
          onClose={() => setShowCycleDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>🔄 Gerenciar Ciclos</DialogTitle>
          <DialogContent>
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom>Ciclos Existentes</Typography>
              {!Array.isArray(cycles) || cycles.length === 0 ? (
                <Typography color="text.secondary">Nenhum ciclo criado ainda.</Typography>
              ) : (
                <List>
                  {cycles.map((cycle) => (
                    <ListItem key={cycle.id} divider>
                      <ListItemIcon>
                        <TimelineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={cycle.nome}
                        secondary={`Criado em ${new Date(cycle.dataInicio).toLocaleDateString()} - ${cycle.ativo ? 'Ativo' : 'Inativo'}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={cycle.ativo ? 'Ativo' : 'Inativo'}
                          color={cycle.ativo ? 'success' : 'default'}
                          size="small"
                        />
                        <IconButton
                          size="small"
                          onClick={() => viewCycleHistory(cycle)}
                          sx={{ color: 'blue' }}
                          title="Ver histórico"
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCycleToDelete(cycle);
                            setShowDeleteCycleDialog(true);
                          }}
                          sx={{ color: 'red' }}
                          title="Excluir ciclo"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            
            <Divider sx={{ marginY: 2 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>Criar Novo Ciclo</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                Selecione até 3 vigílias para criar um novo ciclo. O ciclo anterior será automaticamente desativado.
              </Typography>
              
              <TextField
                fullWidth
                label="Nome do Ciclo"
                value={newCycleName}
                onChange={(e) => setNewCycleName(e.target.value)}
                placeholder="Ex: Ciclo 1 - Temporada 2024"
                sx={{ marginBottom: 2 }}
              />
              
              <Typography variant="subtitle2" gutterBottom>
                Selecionar Vigílias ({selectedVigiliasForCycle.length}/3):
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 2 }}>
                {vigilias.map((vigilia) => (
                  <FormControlLabel
                    key={vigilia.id}
                    control={
                      <Checkbox
                        checked={selectedVigiliasForCycle.includes(vigilia.id)}
                        onChange={() => handleVigiliaSelectionForCycle(vigilia.id)}
                        disabled={selectedVigiliasForCycle.length >= 3 && !selectedVigiliasForCycle.includes(vigilia.id)}
                      />
                    }
                    label={vigilia.nome}
                  />
                ))}
              </Box>
              
              <Button
                variant="contained"
                onClick={createCycle}
                startIcon={<AddIcon />}
                disabled={!newCycleName.trim() || selectedVigiliasForCycle.length === 0}
                fullWidth
              >
                Criar Ciclo
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCycleDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para visualizar histórico de ciclo */}
        <Dialog 
          open={showHistoryViewDialog} 
          onClose={() => setShowHistoryViewDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
            📊 Histórico do Ciclo: {selectedCycleForHistory?.nome}
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: 'white', color: 'black' }}>
            {isLoadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : cycleHistoryData ? (
              <Box>
                {/* Estatísticas Gerais */}
                <Card sx={{ mb: 3, backgroundColor: '#f8f9fa', color: 'black' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                      📈 Estatísticas Gerais do Ciclo
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={2.4}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                            {cycleHistoryData.estatisticasGerais?.totalJogadoresEscalados || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'black' }}>Jogadores Escalados</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#2196F3' }}>
                            {cycleHistoryData.estatisticasGerais?.totalEscalacoes || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'black' }}>Total Escalações</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                            {cycleHistoryData.estatisticasGerais?.totalPresentes || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'black' }}>Total Presentes</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#FF5722' }}>
                            {cycleHistoryData.estatisticasGerais?.totalFaltaram || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'black' }}>Total Faltaram</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box textAlign="center">
                          <Typography variant="h4" sx={{ color: '#9C27B0' }}>
                            {cycleHistoryData.estatisticasGerais?.percentualGeralPresenca || 0}%
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'black' }}>% Presença Geral</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Estatísticas por Jogador Escalado */}
                <Typography variant="h6" gutterBottom sx={{ color: 'black', mb: 2, fontWeight: 'bold' }}>
                  🎯 Estatísticas por Jogador Escalado
                </Typography>
                
                <TableContainer component={Paper} sx={{ backgroundColor: 'white' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Jogador</TableCell>
                        <TableCell>Classe</TableCell>
                        <TableCell>Total Escalações</TableCell>
                        <TableCell>Presentes</TableCell>
                        <TableCell>Faltaram</TableCell>
                        <TableCell>% Presença</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cycleHistoryData.estatisticasPorJogador?.map((jogador: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: 'black' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
                              {jogador.membroNome || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: 'black' }}>
                            <Chip 
                              label={jogador.membroClasse || 'N/A'}
                              size="small"
                              sx={{ 
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'black' }}>
                            <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                              {jogador.totalEscalacoes || 0}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: 'black' }}>
                            <Typography variant="h6" sx={{ color: '#2196F3' }}>
                              {jogador.presentes || 0}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: 'black' }}>
                            <Typography variant="h6" sx={{ color: '#FF5722' }}>
                              {jogador.faltaram || 0}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: 'black' }}>
                            <Chip 
                              label={`${jogador.percentualPresenca || 0}%`}
                              color={
                                (jogador.percentualPresenca || 0) >= 80 ? 'success' :
                                (jogador.percentualPresenca || 0) >= 60 ? 'warning' : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Typography sx={{ color: 'black' }}>
                Nenhum dado encontrado para este ciclo.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {cycleHistoryData && (
              <Button 
                startIcon={<DownloadIcon />}
                onClick={() => exportCycleHistoryToCSV(cycleHistoryData, selectedCycleForHistory?.nome || '')}
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
              >
                Exportar CSV
              </Button>
            )}
            <Button onClick={() => setShowHistoryViewDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para confirmar exclusão de ciclo */}
        <Dialog open={showDeleteCycleDialog} onClose={() => setShowDeleteCycleDialog(false)}>
          <DialogTitle>⚠️ Confirmar Exclusão de Ciclo</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir o ciclo <strong>"{cycleToDelete?.nome}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Esta ação não pode ser desfeita e removerá todas as associações com vigílias.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteCycleDialog(false)}>Cancelar</Button>
            <Button onClick={deleteCycle} variant="contained" color="error">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageWrapper>
  );
};
