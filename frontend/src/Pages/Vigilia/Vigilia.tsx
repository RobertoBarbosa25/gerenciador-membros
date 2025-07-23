import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    TextField,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { Player, Partida } from '../../Types/Rank';
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
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [salas, setSalas] = useState<Partida[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
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
            } catch (error) {
                toast.error('Erro ao carregar dados da Vigilia.');
            } finally {
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
            ? availablePlayers.filter(player =>
                normalizeString(player.name).includes(normalizeString(debouncedSearchTerm))
            )
            : availablePlayers;
        if (sortConfig) {
            playersToDisplay = [...playersToDisplay].sort((a, b) => {
                if (sortConfig.key === 'name') {
                    return sortConfig.direction === 'ascending'
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                } else if (sortConfig.key === 'resonance') {
                    return sortConfig.direction === 'ascending'
                        ? a.resonance - b.resonance
                        : b.resonance - a.resonance;
                } else if (sortConfig.key === 'class') {
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
    const movePlayerToTower = async (player: Player, targetTowerIndex: number) => {
        const sala = salas[targetTowerIndex];
        if (!sala) return;
        if (sala.membros.length >= (sala.capacidadeMaximaJogadores || MAX_ATTACK_PLAYERS)) {
            toast.error("Limite de jogadores na sala atingido.");
            return;
        }
        setLoading(true);
        try {
            const updatedSala = await vigiliaApi.adicionarMembroASala(sala.id, player.id);
            setSalas(prev => prev.map((s, idx) => idx === targetTowerIndex ? updatedSala : s));
            toast.success(`Jogador ${player.name} adicionado à sala ${salaNames[targetTowerIndex]}`);
        } catch (error) {
            toast.error('Erro ao mover jogador para a sala.');
        } finally {
            setLoading(false);
        }
    };

    // Remover jogador da sala
    const removePlayerFromTower = async (player: Player, towerIndex: number) => {
        const sala = salas[towerIndex];
        if (!sala) return;
        setLoading(true);
        try {
            const updatedSala = await vigiliaApi.removerMembroDaSala(sala.id, player.id);
            setSalas(prev => prev.map((s, idx) => idx === towerIndex ? updatedSala : s));
            toast.success(`Jogador ${player.name} removido da sala ${salaNames[towerIndex]}`);
        } catch (error) {
            toast.error('Erro ao remover jogador da sala.');
        } finally {
            setLoading(false);
        }
    };

    // Resetar uma sala
    const resetTower = async (index: number) => {
        const sala = salas[index];
        if (!sala) return;
        setLoading(true);
        try {
            await vigiliaApi.resetarSala(sala.id);
            const novasSalas = await vigiliaApi.getSalas();
            setSalas(novasSalas.slice(0, 12));
            toast.success(`Sala ${salaNames[index]} resetada com sucesso!`);
        } catch (error) {
            toast.error('Erro ao resetar a sala.');
        } finally {
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
        } catch (error) {
            toast.error('Erro ao resetar todas as salas.');
        } finally {
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

    return (
        <PageWrapper>
            {loading && (
                <Box style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={80} />
                </Box>
            )}
            <BoxMembros sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                    <TableContainer component={Paper}
                        style={{
                            height: '100%',
                            overflowY: 'auto',
                            overflowX: 'auto',
                            width: '100%',
                            minWidth: 0,
                            background: '#23272f',
                        }}>
                        <Box style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', background: '#23272f' }}>
                            <Typography variant="h6" style={{ padding: '16px', color: '#fff' }}>Lixos Disponíveis</Typography>
                            <Button variant="contained" color="secondary" onClick={handleDialogOpen}>
                                Reset
                            </Button>
                            <Box style={{ padding: '16px' }}>
                                <TextField
                                    label="Buscar por nome"
                                    variant="outlined"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ background: '#23272f', borderRadius: 2, input: { color: '#fff' } }}
                                    InputLabelProps={{ sx: { color: '#aaa' } }}
                                />
                            </Box>
                        </Box>
                        <StyledTable>
                            <TableHead>
                                <TableRowMod>
                                    <TableCellMod onClick={sortByName} style={{ cursor: 'pointer', fontWeight: 'bold', maxWidth: 100, width: 100 }}>Nome</TableCellMod>
                                    <TableCellMod onClick={sortByResonance} style={{ cursor: 'pointer', fontWeight: 'bold', maxWidth: 60, width: 60, textAlign: 'center' }}>Ress</TableCellMod>
                                    <TableCellMod onClick={sortByClass} style={{ cursor: 'pointer', fontWeight: 'bold', maxWidth: 90, width: 90, textAlign: 'center' }}>Classe</TableCellMod>
                                    <TableCellMod style={{ maxWidth: 90, width: 90, textAlign: 'right' }}>Mover</TableCellMod>
                                </TableRowMod>
                            </TableHead>
                            <TableBody>
                                {filteredPlayers.map((player) => {
                                    const currentTowerIndex = salas.findIndex(sala => sala.membros.some(p => p.id === player.id));
                                    return (
                                        <TableRow
                                            key={player.id}
                                            sx={{ backgroundColor: getClassBackgroundColor(player.memberClass) }}
                                        >
                                            <TableCellMod style={{ maxWidth: 100, width: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {player.name}
                                            </TableCellMod>
                                            <TableCellMod style={{ maxWidth: 60, width: 60, textAlign: 'center' }}>{player.resonance}</TableCellMod>
                                            <TableCellMod style={{ maxWidth: 90, width: 90, textAlign: 'center' }}>{translateClass(player.memberClass)}</TableCellMod>
                                            <TableCellMod style={{ maxWidth: 90, width: 90, textAlign: 'right' }}>
                                                <Select
                                                    value={currentTowerIndex !== -1 ? currentTowerIndex : ''}
                                                    onChange={(e) => {
                                                        const targetIndex = Number(e.target.value);
                                                        if (targetIndex !== -1) {
                                                            movePlayerToTower(player, targetIndex);
                                                        }
                                                    }}
                                                    fullWidth
                                                    size="small"
                                                    sx={{ width: 36, background: '#23272f', color: '#fff', borderRadius: 1, '.MuiSelect-icon': { color: '#fff', right: 0 }, '.MuiSelect-select': { color: '#fff', paddingRight: '24px', textAlign: 'center' } }}
                                                >
                                                    {salas.map((_, targetIndex) => (
                                                        <MenuItem key={targetIndex} value={targetIndex}>
                                                            {salaNames[targetIndex] || `Sala ${targetIndex + 1}`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCellMod>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </StyledTable>
                    </TableContainer>
                </Box>
            </BoxMembros>
            <BoxVigilia>
                {salas.map((sala, index) => (
                    <Box key={normalizeString(`vigilia-room-${index}`)}>
                        <PlayerCard>
                            <RoomTitle>
                                <Typography variant="h6"
                                    sx={{
                                        padding: '10px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }}>
                                    Players {`${sala.membros.length}/${sala.capacidadeMaximaJogadores || MAX_ATTACK_PLAYERS}`}
                                </Typography>
                                <Button variant="contained" color="warning" onClick={() => resetTower(index)}>
                                    <Recycling />
                                </Button>
                            </RoomTitle>
                            <StyledTable>
                                <TableHead>
                                    <TableRowMod>
                                        <TableCellMod>Nome</TableCellMod>
                                        <TableCellMod>Ress</TableCellMod>
                                        <TableCellMod>Classe</TableCellMod>
                                        <TableCellMod>Sala</TableCellMod>
                                        <TableCell></TableCell>
                                    </TableRowMod>
                                </TableHead>
                                <TableBody>
                                    {sala.membros.map((player: Player) => (
                                        <TableRow
                                            key={player.id}
                                            sx={{ backgroundColor: getClassBackgroundColor(player.memberClass) }}
                                        >
                                            <TableCellMod>
                                                <span style={{ display: 'block', maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {player.name.length > 8 ? player.name.slice(0, 8) + '…' : player.name}
                                                </span>
                                            </TableCellMod>
                                            <TableCellMod>{player.resonance}</TableCellMod>
                                            <TableCellMod>{translateClass(player.memberClass)}</TableCellMod>
                                            <TableCellMod>{salaNames[index] || `Sala ${index + 1}`}</TableCellMod>
                                            <TableCellMod>
                                                <Button variant="contained" style={{ padding: 0, minWidth: 0 }} onClick={() => removePlayerFromTower(player, index)}>
                                                    <DisabledByDefault />
                                                </Button>
                                            </TableCellMod>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </PlayerCard>
                    </Box>
                ))}
            </BoxVigilia>
            {/* Dialog de confirmação para resetar todas as torres */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Confirmar Reset</DialogTitle>
                <DialogContent>
                    <Typography>Tem certeza que deseja resetar todas as salas?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleResetAllTowers} color="secondary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </PageWrapper>
    );
};
