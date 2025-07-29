import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/Pages/Rito/Rito.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, TableRow, Paper, Button, Typography, TextField, CircularProgress } from '@mui/material';
import { PageWrapper } from '../../Components/PageWrapper';
import { BoxMembros, BoxRito } from './Rito.styles'; // Manter os customizados
import { normalizeString } from '../../Utils/normalizeString'; // Manter a importação, pois é útil para a busca
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { translateClass } from '../../Utils/Utils';
import { getClassBackgroundColor } from '../../Utils/classColors';
import { AvailablePlayersTable } from './AvailablePlayersTable';
import { RoomHeader, RoomMembersTable, ConfirmDialog } from './components';
import { usePartidas } from './hooks/usePartidas';
// --- ANIMAÇÕES CUSTOMIZADAS ---
import { keyframes, styled } from '@mui/system';
import membrosApi from '../../Services/membrosApi';
import ritoApi from '../../Services/ritoApi';
const fadeIn = keyframes `
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;
const highlightGreen = keyframes `
    0% { background-color: rgba(76, 175, 80, 0.4); }
    100% { background-color: transparent; }
`;
const highlightRed = keyframes `
    0% { background-color: rgba(244, 67, 54, 0.4); }
    100% { background-color: transparent; }
`;
export const AnimatedTableRow = styled(TableRow) `
    &.highlight-green {
        animation: ${highlightGreen} 1.5s ease-out forwards;
    }
    &.highlight-red {
        animation: ${highlightRed} 1.5s ease-out forwards;
    }
`;
export const RitoPage = () => {
    const [allPlayers, setAllPlayers] = useState([]);
    const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
    // usePartidas centraliza partidas e loading
    const { partidas, setPartidas, isLoadingPartidas, fetchPartidas, updatePartidaName, } = usePartidas();
    // Estados de loading para feedback visual
    const [isSavingName, setIsSavingName] = useState(false);
    const [loadingPlayerId, setLoadingPlayerId] = useState(null);
    const [isResettingRoom, setIsResettingRoom] = useState(null);
    const [isResettingAllRooms, setIsResettingAllRooms] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [roomToReset, setRoomToReset] = useState(null);
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [highlightType, setHighlightType] = useState(null);
    const [editingPartidaId, setEditingPartidaId] = useState(null);
    const [editingPartidaName, setEditingPartidaName] = useState('');
    // --- Funções de API ---
    const fetchAllMembers = useCallback(async () => {
        setIsLoadingPlayers(true);
        try {
            const data = await membrosApi.getMembros();
            setAllPlayers(data);
            console.log("Membros carregados do backend!");
        }
        catch (err) {
            console.error("Erro ao buscar membros:", err);
            toast.error("Falha ao carregar membros do backend. Recarregue a página.");
            setAllPlayers([]);
        }
        finally {
            setIsLoadingPlayers(false);
        }
    }, []);
    useEffect(() => {
        const initializeBackendPartidas = async () => {
            try {
                await ritoApi.inicializarPartidasBackend();
                console.log("Partidas do backend inicializadas/verificadas.");
            }
            catch (error) {
                console.error("Erro ao inicializar partidas no backend:", error);
            }
        };
        initializeBackendPartidas();
        fetchPartidas();
        fetchAllMembers();
    }, [fetchPartidas, fetchAllMembers]);
    const availablePlayers = useMemo(() => {
        const playersInPartidas = new Set();
        partidas.forEach(partida => {
            partida.membros.forEach(membro => playersInPartidas.add(membro.id));
        });
        let filtered = allPlayers.filter(player => !playersInPartidas.has(player.id));
        if (debouncedSearchTerm) {
            filtered = filtered.filter(player => normalizeString(player.name).includes(normalizeString(debouncedSearchTerm)));
        }
        return filtered;
    }, [allPlayers, partidas, debouncedSearchTerm]);
    const startEditingPartidaName = (partida) => {
        setEditingPartidaId(partida.id);
        setEditingPartidaName(partida.nome);
    };
    const cancelEditingPartidaName = () => {
        setEditingPartidaId(null);
        setEditingPartidaName('');
    };
    const savePartidaName = async (partidaId) => {
        const trimmedName = editingPartidaName.trim();
        let nameToUpdate = trimmedName;
        if (trimmedName === "") {
            const currentPartida = partidas.find(p => p.id === partidaId);
            if (currentPartida) {
                nameToUpdate = `Partida ${currentPartida.id}`;
                toast.info(`O nome da partida não pode ser vazio. Usando "${nameToUpdate}".`);
            }
            else {
                toast.error("Erro: Partida não encontrada para definir nome padrão.");
                return;
            }
        }
        setIsSavingName(true);
        await updatePartidaName(partidaId, nameToUpdate);
        setIsSavingName(false);
        setEditingPartidaId(null);
        setEditingPartidaName('');
    };
    const movePlayerToRoom = async (player, currentPartidaId, targetPartidaId) => {
        setLoadingPlayerId(player.id);
        // ⭐️ ADIÇÃO: Se o targetPartidaId for 0, significa que o jogador deve ser REMOVIDO da sala atual
        if (targetPartidaId === 0 && currentPartidaId !== null) {
            await removePlayerFromRoom(player, currentPartidaId); // Chama a função dedicada de remoção
            return; // Sai da função após a remoção
        }
        const targetPartida = partidas.find(p => p.id === targetPartidaId);
        if (!targetPartida) {
            toast.error("Partida de destino não encontrada.");
            return;
        }
        if (targetPartida.membros.length >= targetPartida.capacidadeMaximaJogadores) {
            toast.error('Limite de jogadores na sala atingido.');
            return;
        }
        const originalPartidas = [...partidas];
        const originalAllPlayers = [...allPlayers];
        // Atualização otimista do estado local
        setPartidas(prevPartidas => {
            let newPartidas = prevPartidas.map(p => {
                if (p.id === currentPartidaId) { // Remove da sala atual (se houver)
                    return { ...p, membros: p.membros.filter(m => m.id !== player.id) };
                }
                if (p.id === targetPartidaId) { // Adiciona à sala de destino
                    if (!p.membros.some(m => m.id === player.id)) { // Evita duplicatas
                        return { ...p, membros: [...p.membros, player] };
                    }
                }
                return p;
            });
            return newPartidas;
        });
        // Se o jogador estiver vindo da lista de disponíveis (currentPartidaId === null), remove-o de lá
        if (currentPartidaId === null) {
            setAllPlayers(prevPlayers => prevPlayers.filter(p => p.id !== player.id));
        }
        try {
            if (currentPartidaId !== null) {
                // Se estava em uma sala, primeiro remove dela
                await ritoApi.removeMembroFromPartida(currentPartidaId, player.id);
            }
            // Depois adiciona à nova sala
            await ritoApi.addMembroToPartida(targetPartidaId, player.id);
            setHighlightedRow(player.id);
            setHighlightType('green');
            const timer = setTimeout(() => {
                setHighlightedRow(null);
                setHighlightType(null);
            }, 1500);
            toast.success(`Jogador ${player.name} movido para ${targetPartida.nome}!`);
            return () => clearTimeout(timer);
        }
        catch (error) {
            console.error("Erro ao mover jogador:", error);
            setPartidas(originalPartidas);
            setAllPlayers(originalAllPlayers);
            toast.error("Falha ao mover jogador. Revertendo alterações.");
        }
        finally {
            setLoadingPlayerId(null);
        }
    };
    // ⭐️ Função removePlayerFromRoom atualizada para ser mais robusta
    const removePlayerFromRoom = async (player, currentPartidaId) => {
        const originalPartidas = [...partidas];
        const originalAllPlayers = [...allPlayers];
        setPartidas(prevPartidas => {
            return prevPartidas.map(p => p.id === currentPartidaId
                ? { ...p, membros: p.membros.filter(m => m.id !== player.id) }
                : p);
        });
        // Garante que o jogador seja adicionado de volta apenas se ele não estiver já na lista de availablePlayers
        setAllPlayers(prevPlayers => {
            if (!prevPlayers.some(p => p.id === player.id)) {
                return [...prevPlayers, player];
            }
            return prevPlayers;
        });
        try {
            await ritoApi.removeMembroFromPartida(currentPartidaId, player.id);
            setHighlightedRow(player.id);
            setHighlightType('red'); // Define a cor vermelha para remoção
            const timer = setTimeout(() => {
                setHighlightedRow(null);
                setHighlightType(null);
            }, 1500);
            toast.info(`Jogador ${player.name} removido da sala.`);
            return () => clearTimeout(timer);
        }
        catch (error) {
            console.error("Erro ao remover jogador da sala:", error);
            setPartidas(originalPartidas);
            setAllPlayers(originalAllPlayers);
            toast.error("Falha ao remover jogador da sala. Revertendo alterações.");
        }
    };
    // Função genérica para resetar sala(s)
    const handleReset = (partidaId) => {
        if (partidaId === null)
            return;
        setRoomToReset(partidaId);
        setOpenConfirmDialog(true);
    };
    // Wrappers para manter compatibilidade com o restante do código
    const resetRoom = (partidaId) => handleReset(partidaId);
    const resetAllRooms = () => handleReset(-1);
    const confirmResetRoom = async () => {
        if (roomToReset === null)
            return;
        const partidaToReset = partidas.find(p => p.id === roomToReset);
        if (!partidaToReset)
            return;
        const originalPartidas = [...partidas];
        const originalAllPlayers = [...allPlayers];
        setPartidas(prevPartidas => prevPartidas.map(p => p.id === roomToReset
            ? { ...p, membros: [] }
            : p));
        setAllPlayers(prevPlayers => [...prevPlayers, ...partidaToReset.membros]);
        try {
            for (const membro of partidaToReset.membros) {
                await ritoApi.removeMembroFromPartida(roomToReset, membro.id);
            }
            toast.info(`Jogadores removidos.`);
        }
        catch (error) {
            console.error("Erro ao resetar partida:", error);
            setPartidas(originalPartidas);
            setAllPlayers(originalAllPlayers);
            toast.error("Falha ao resetar partida. Revertendo alterações.");
        }
        finally {
            setIsResettingRoom(null);
            setOpenConfirmDialog(false);
            setRoomToReset(null);
        }
    };
    const confirmResetAllRooms = async () => {
        setIsResettingAllRooms(true);
        const originalPartidas = [...partidas];
        const originalAllPlayers = [...allPlayers];
        // Refatoração: calcula todos os jogadores a serem resetados fora do setState
        const allPlayersToReset = partidas.flatMap(p => p.membros);
        setPartidas(prevPartidas => prevPartidas.map(p => ({ ...p, membros: [] })));
        setAllPlayers(prevPlayers => [...prevPlayers, ...allPlayersToReset]);
        try {
            for (const partida of originalPartidas) {
                for (const membro of partida.membros) {
                    await ritoApi.removeMembroFromPartida(partida.id, membro.id);
                }
            }
            toast.success("Todas as salas foram resetadas!");
        }
        catch (error) {
            console.error("Erro ao resetar todas as salas:", error);
            setPartidas(originalPartidas);
            setAllPlayers(originalAllPlayers);
            toast.error("Falha ao resetar todas as salas. Revertendo alterações.");
        }
        finally {
            setIsResettingAllRooms(false);
            setOpenConfirmDialog(false);
            setRoomToReset(null);
        }
    };
    const cancelResetDialog = () => {
        setOpenConfirmDialog(false);
        setRoomToReset(null);
    };
    return (_jsxs(PageWrapper, { children: [_jsx(BoxMembros, { children: _jsxs(Box, { sx: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fundo suave para a área de membros
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Sombra sutil
                    }, children: [_jsxs(Box, { sx: {
                                position: 'sticky',
                                top: 0,
                                zIndex: 1,
                                display: 'flex',
                                flexDirection: 'column', // Alterado para coluna para colocar o TextField abaixo
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                gap: 2,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo mais escuro para o cabeçalho fixo
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Linha divisória
                                borderRadius: '8px 8px 0 0', // Bordas arredondadas apenas no topo
                            }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'white', whiteSpace: 'nowrap', flexGrow: 1 }, children: "Lixos Dispon\u00EDveis" }), _jsx(Button, { variant: "contained", color: "error", onClick: resetAllRooms, sx: {
                                                whiteSpace: 'nowrap',
                                                ml: 2,
                                                backgroundColor: '#d32f2f',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                minWidth: 120,
                                                px: 1.5,
                                                py: 0.5,
                                                fontSize: '0.95rem',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                                '&:hover': {
                                                    backgroundColor: '#b71c1c',
                                                    color: '#fff',
                                                },
                                            }, "aria-label": "Resetar todas as salas", children: "Resetar Todas" })] }), _jsx(TextField, { label: "Buscar por nome", variant: "outlined", size: "small", fullWidth: true, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputLabelProps: { sx: { color: 'rgba(255, 255, 255, 0.7)' } }, InputProps: { sx: { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' } } } })] }), _jsx(AvailablePlayersTable, { availablePlayers: availablePlayers, partidas: partidas, isLoading: isLoadingPlayers, movePlayerToRoom: movePlayerToRoom, getClassBackgroundColor: getClassBackgroundColor, translateClass: translateClass })] }) }), _jsx(BoxRito, { children: isLoadingPartidas ? (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }, children: [_jsx(CircularProgress, {}), _jsx(Typography, { sx: { ml: 2, color: 'white' }, children: "Carregando partidas..." })] })) : (partidas.map((partida) => (_jsxs(Paper, { elevation: 6, sx: {
                        background: 'linear-gradient(135deg, rgba(30, 40, 50, 0.9), rgba(40, 50, 60, 0.9))', // Gradiente de fundo
                        borderRadius: '12px',
                        overflow: 'hidden', // Importante para clipar o conteúdo interno
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%', // Fazer cada Paper ocupar 100% da altura da BoxRito (se houver apenas 1, ou se o flex wrap estiver habilitado)
                        minWidth: '300px', // Largura mínima para salas
                        flexBasis: 'calc(50% - 8px)', // Tenta ocupar 50% da largura com um gap de 16px
                        flexGrow: 1, // Permite que cada sala cresça
                        flexShrink: 0, // Impede que as salas encolham demais
                        animation: `${fadeIn} 0.5s ease-out`, // Animação de entrada
                        border: '1px solid rgba(255,255,255,0.1)', // Borda sutil
                        '&:hover': {
                            transform: 'translateY(-2px)', // Efeito sutil ao passar o mouse
                            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                        },
                        transition: 'all 0.3s ease-in-out', // Transição suave para hover
                        mb: 3, // espaçamento extra entre salas
                    }, children: [_jsx(RoomHeader, { isEditing: editingPartidaId === partida.id, name: partida.nome, membersCount: partida.membros.length, maxMembers: partida.capacidadeMaximaJogadores, editingName: editingPartidaName, onEdit: () => startEditingPartidaName(partida), onChangeName: (e) => setEditingPartidaName(e.target.value), onSave: () => savePartidaName(partida.id), onCancel: cancelEditingPartidaName, onReset: () => resetRoom(partida.id), isSavingName: isSavingName }), _jsx(RoomMembersTable, { membros: partida.membros, partidas: partidas, partidaId: partida.id, getClassBackgroundColor: getClassBackgroundColor, translateClass: translateClass, highlightedRow: highlightedRow, highlightType: highlightType, movePlayerToRoom: movePlayerToRoom, loadingPlayerId: loadingPlayerId })] }, partida.id)))) }), _jsx(ConfirmDialog, { open: openConfirmDialog, title: roomToReset === -1 ? "Confirmar Reset de Todas as Salas" : `Confirmar Reset da Sala`, message: roomToReset === -1
                    ? "Tem certeza que deseja remover TODOS os membros de TODAS as salas? Esta ação não pode ser desfeita."
                    : `Tem certeza que deseja remover todos os membros da sala "${partidas.find(p => p.id === roomToReset)?.nome || 'desconhecida'}"? Esta ação não pode ser desfeita.`, onCancel: cancelResetDialog, onConfirm: roomToReset === -1 ? confirmResetAllRooms : confirmResetRoom, isResettingAllRooms: isResettingAllRooms, isResettingRoom: isResettingRoom })] }));
};
