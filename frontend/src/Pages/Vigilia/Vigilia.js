import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Recycling, DisabledByDefault } from '@mui/icons-material';
import { PageWrapper } from '../../Components/PageWrapper';
import { RoomTitle, BoxVigilia, PlayerCard, BoxMembros, StyledTable, TableRowMod, TableCellMod } from './Vigilia.styles';
import { normalizeString } from '../../Utils/normalizeString';
import { MAX_ATTACK_PLAYERS } from './Vigilia.utils';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { translateClass } from '../../Utils';
import { getClassBackgroundColor } from '../../Utils/classColors';
import membrosApi from '../../Services/membrosApi';
import vigiliaApi from '../../Services/vigiliaApi';
import CircularProgress from '@mui/material/CircularProgress';
export const VigiliaPage = () => {
    const [allPlayers, setAllPlayers] = useState([]);
    const [salas, setSalas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortConfig, setSortConfig] = useState(null);
    const salaNames = [
        "A1", "A2", "A3",
        "B1", "B2", "B3",
        "C1", "C2", "C3",
        "D1", "D2", "D3"
    ];
    // Carregar jogadores e salas do backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [players, salasBackend] = await Promise.all([
                    membrosApi.getMembros(),
                    vigiliaApi.getSalas()
                ]);
                setAllPlayers(players);
                setSalas(salasBackend.slice(0, 12)); // Considera só as 12 primeiras salas
            }
            catch (error) {
                toast.error('Erro ao carregar dados da Vigilia.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    // Jogadores disponíveis = todos - os que estão em qualquer sala
    const availablePlayers = useMemo(() => {
        const playersInSalas = new Set(salas.flatMap(sala => sala.membros.map(m => m.id)));
        return allPlayers.filter(player => !playersInSalas.has(player.id));
    }, [allPlayers, salas]);
    // Filtro e ordenação
    const filteredPlayers = useMemo(() => {
        let playersToDisplay = debouncedSearchTerm
            ? availablePlayers.filter(player => normalizeString(player.name).includes(normalizeString(debouncedSearchTerm)))
            : availablePlayers;
        if (sortConfig) {
            playersToDisplay = [...playersToDisplay].sort((a, b) => {
                if (sortConfig.key === 'name') {
                    return sortConfig.direction === 'ascending'
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                }
                else if (sortConfig.key === 'resonance') {
                    return sortConfig.direction === 'ascending'
                        ? a.resonance - b.resonance
                        : b.resonance - a.resonance;
                }
                else if (sortConfig.key === 'class') {
                    return sortConfig.direction === 'ascending'
                        ? a.memberClass.localeCompare(b.memberClass)
                        : b.memberClass.localeCompare(a.memberClass);
                }
                return 0;
            });
        }
        return playersToDisplay;
    }, [debouncedSearchTerm, availablePlayers, sortConfig]);
    // Adicionar jogador à sala
    const movePlayerToTower = async (player, targetTowerIndex) => {
        const sala = salas[targetTowerIndex];
        if (!sala)
            return;
        if (sala.membros.length >= (sala.capacidadeMaximaJogadores || MAX_ATTACK_PLAYERS)) {
            toast.error("Limite de jogadores na sala atingido.");
            return;
        }
        setLoading(true);
        try {
            const updatedSala = await vigiliaApi.adicionarMembroASala(sala.id, player.id);
            setSalas(prev => prev.map((s, idx) => idx === targetTowerIndex ? updatedSala : s));
            toast.success(`Jogador ${player.name} adicionado à sala ${salaNames[targetTowerIndex]}`);
        }
        catch (error) {
            toast.error('Erro ao mover jogador para a sala.');
        }
        finally {
            setLoading(false);
        }
    };
    // Remover jogador da sala
    const removePlayerFromTower = async (player, towerIndex) => {
        const sala = salas[towerIndex];
        if (!sala)
            return;
        setLoading(true);
        try {
            const updatedSala = await vigiliaApi.removerMembroDaSala(sala.id, player.id);
            setSalas(prev => prev.map((s, idx) => idx === towerIndex ? updatedSala : s));
            toast.success(`Jogador ${player.name} removido da sala ${salaNames[towerIndex]}`);
        }
        catch (error) {
            toast.error('Erro ao remover jogador da sala.');
        }
        finally {
            setLoading(false);
        }
    };
    // Resetar uma sala
    const resetTower = async (index) => {
        const sala = salas[index];
        if (!sala)
            return;
        setLoading(true);
        try {
            await vigiliaApi.resetarSala(sala.id);
            const novasSalas = await vigiliaApi.getSalas();
            setSalas(novasSalas.slice(0, 12));
            toast.success(`Sala ${salaNames[index]} resetada com sucesso!`);
        }
        catch (error) {
            toast.error('Erro ao resetar a sala.');
        }
        finally {
            setLoading(false);
        }
    };
    // Resetar todas as salas
    const handleResetAllTowers = async () => {
        setLoading(true);
        try {
            await vigiliaApi.resetarTodasSalas();
            const novasSalas = await vigiliaApi.getSalas();
            setSalas(novasSalas.slice(0, 12));
            setOpenDialog(false);
            toast.success("Todas as salas foram resetadas.");
        }
        catch (error) {
            toast.error('Erro ao resetar todas as salas.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const handleDialogOpen = () => {
        setOpenDialog(true);
    };
    // Funções para ordenar
    const sortByName = () => {
        const direction = sortConfig?.key === 'name' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key: 'name', direction });
    };
    const sortByResonance = () => {
        const direction = sortConfig?.key === 'resonance' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key: 'resonance', direction });
    };
    const sortByClass = () => {
        const direction = sortConfig?.key === 'class' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key: 'class', direction });
    };
    return (_jsxs(PageWrapper, { children: [loading && (_jsx(Box, { style: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(CircularProgress, { size: 80 }) })), _jsx(BoxMembros, { sx: { width: '100%' }, children: _jsx(Box, { sx: { width: '100%' }, children: _jsxs(TableContainer, { component: Paper, style: {
                            height: '100%',
                            overflowY: 'auto',
                            overflowX: 'auto',
                            width: '100%',
                            minWidth: 0,
                            background: '#23272f',
                        }, children: [_jsxs(Box, { style: { position: 'relative', display: 'flex', justifyContent: 'space-between', background: '#23272f' }, children: [_jsx(Typography, { variant: "h6", style: { padding: '16px', color: '#fff' }, children: "Lixos Dispon\u00EDveis" }), _jsx(Button, { variant: "contained", color: "secondary", onClick: handleDialogOpen, children: "Reset" }), _jsx(Box, { style: { padding: '16px' }, children: _jsx(TextField, { label: "Buscar por nome", variant: "outlined", fullWidth: true, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), sx: { background: '#23272f', borderRadius: 2, input: { color: '#fff' } }, InputLabelProps: { sx: { color: '#aaa' } } }) })] }), _jsxs(StyledTable, { children: [_jsx(TableHead, { children: _jsxs(TableRowMod, { children: [_jsx(TableCellMod, { onClick: sortByName, style: { cursor: 'pointer', fontWeight: 'bold', maxWidth: 100, width: 100 }, children: "Nome" }), _jsx(TableCellMod, { onClick: sortByResonance, style: { cursor: 'pointer', fontWeight: 'bold', maxWidth: 60, width: 60, textAlign: 'center' }, children: "Ress" }), _jsx(TableCellMod, { onClick: sortByClass, style: { cursor: 'pointer', fontWeight: 'bold', maxWidth: 90, width: 90, textAlign: 'center' }, children: "Classe" }), _jsx(TableCellMod, { style: { maxWidth: 90, width: 90, textAlign: 'right' }, children: "Mover" })] }) }), _jsx(TableBody, { children: filteredPlayers.map((player) => {
                                            const currentTowerIndex = salas.findIndex(sala => sala.membros.some(p => p.id === player.id));
                                            return (_jsxs(TableRow, { sx: { backgroundColor: getClassBackgroundColor(player.memberClass) }, children: [_jsx(TableCellMod, { style: { maxWidth: 100, width: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: player.name }), _jsx(TableCellMod, { style: { maxWidth: 60, width: 60, textAlign: 'center' }, children: player.resonance }), _jsx(TableCellMod, { style: { maxWidth: 90, width: 90, textAlign: 'center' }, children: translateClass(player.memberClass) }), _jsx(TableCellMod, { style: { maxWidth: 90, width: 90, textAlign: 'right' }, children: _jsx(Select, { value: currentTowerIndex !== -1 ? currentTowerIndex : '', onChange: (e) => {
                                                                const targetIndex = Number(e.target.value);
                                                                if (targetIndex !== -1) {
                                                                    movePlayerToTower(player, targetIndex);
                                                                }
                                                            }, fullWidth: true, size: "small", sx: { width: 36, background: '#23272f', color: '#fff', borderRadius: 1, '.MuiSelect-icon': { color: '#fff', right: 0 }, '.MuiSelect-select': { color: '#fff', paddingRight: '24px', textAlign: 'center' } }, children: salas.map((_, targetIndex) => (_jsx(MenuItem, { value: targetIndex, children: salaNames[targetIndex] || `Sala ${targetIndex + 1}` }, targetIndex))) }) })] }, player.id));
                                        }) })] })] }) }) }), _jsx(BoxVigilia, { children: salas.map((sala, index) => (_jsx(Box, { children: _jsxs(PlayerCard, { children: [_jsxs(RoomTitle, { children: [_jsxs(Typography, { variant: "h6", sx: {
                                            padding: '10px',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '16px'
                                        }, children: ["Players ", `${sala.membros.length}/${sala.capacidadeMaximaJogadores || MAX_ATTACK_PLAYERS}`] }), _jsx(Button, { variant: "contained", color: "warning", onClick: () => resetTower(index), children: _jsx(Recycling, {}) })] }), _jsxs(StyledTable, { children: [_jsx(TableHead, { children: _jsxs(TableRowMod, { children: [_jsx(TableCellMod, { children: "Nome" }), _jsx(TableCellMod, { children: "Ress" }), _jsx(TableCellMod, { children: "Classe" }), _jsx(TableCellMod, { children: "Sala" }), _jsx(TableCell, {})] }) }), _jsx(TableBody, { children: sala.membros.map((player) => (_jsxs(TableRow, { sx: { backgroundColor: getClassBackgroundColor(player.memberClass) }, children: [_jsx(TableCellMod, { children: _jsx("span", { style: { display: 'block', maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: player.name.length > 8 ? player.name.slice(0, 8) + '…' : player.name }) }), _jsx(TableCellMod, { children: player.resonance }), _jsx(TableCellMod, { children: translateClass(player.memberClass) }), _jsx(TableCellMod, { children: salaNames[index] || `Sala ${index + 1}` }), _jsx(TableCellMod, { children: _jsx(Button, { variant: "contained", style: { padding: 0, minWidth: 0 }, onClick: () => removePlayerFromTower(player, index), children: _jsx(DisabledByDefault, {}) }) })] }, player.id))) })] })] }) }, normalizeString(`vigilia-room-${index}`)))) }), _jsxs(Dialog, { open: openDialog, onClose: handleDialogClose, children: [_jsx(DialogTitle, { children: "Confirmar Reset" }), _jsx(DialogContent, { children: _jsx(Typography, { children: "Tem certeza que deseja resetar todas as salas?" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleDialogClose, color: "primary", children: "Cancelar" }), _jsx(Button, { onClick: handleResetAllTowers, color: "secondary", children: "Confirmar" })] })] })] }));
};
