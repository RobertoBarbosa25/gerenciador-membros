import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Tooltip, Typography, Box
} from '@mui/material';

type Player = {
    id: number;
    name: string;
    resonance: number;
    memberClass: "Arcanista" | "Bárbaro" | "Cavaleiro de Sangue" | "Cruzado" | "Caçador de Demônios" | "Necromante" | "Tempestário" | "Monge" | "Druida";
    phone: string;
    discordId: string;
    cla: "Chernobyl" | "Maktub" | "Warlords" | "Arkyn";

};

type Partida = {
    id: number;
    nome: string;
    membros: Player[];
    capacidadeMaximaJogadores: number;
};

type Props = {
    availablePlayers: Player[];
    partidas: Partida[];
    isLoading: boolean;
    movePlayerToRoom: (player: Player, currentPartidaId: number | null, targetPartidaId: number) => void;
    getClassBackgroundColor: (memberClass: string) => string;
    translateClass: (memberClass: string) => string;
};

export const AvailablePlayersTable: React.FC<Props> = ({
    availablePlayers,
    partidas,
    isLoading,
    movePlayerToRoom,
    getClassBackgroundColor,
    translateClass,
}) => (
    <TableContainer component={Paper} sx={{
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '0 0 8px 8px',
    }}>
        <Table stickyHeader sx={{
            '& .MuiTableCell-root': {
                color: 'white',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                position: 'sticky',
                top: 0,
                zIndex: 2,
            },
            '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
                borderBottom: 'none',
            }
        }}>
            <TableHead>
                <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Ress</TableCell>
                    <TableCell>Classe</TableCell>
                    <TableCell>Cla</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>Mover</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={5} align="center">
                            <Typography sx={{ color: 'white' }}>Carregando membros...</Typography>
                        </TableCell>
                    </TableRow>
                ) : availablePlayers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ borderBottom: 'none', py: 3 }}>
                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Nenhum membro disponível.</Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    availablePlayers.map((player, idx) => (
                        <TableRow
                            key={`${player.id}-${idx}`}
                            sx={{ backgroundColor: getClassBackgroundColor(player.memberClass) }}
                        >
                            <TableCell sx={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={player.name} placement="top" arrow>
                                    <Typography sx={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {player.name}
                                    </Typography>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{player.resonance}</TableCell>
                            <TableCell>{translateClass(player.memberClass)}</TableCell>
                            <TableCell>{player.cla}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                <Select
                                    value={''}
                                    onChange={(e) => {
                                        const targetId = Number(e.target.value);
                                        if (!isNaN(targetId)) {
                                            movePlayerToRoom(player, null, targetId);
                                        }
                                    }}
                                    displayEmpty
                                    size="small"
                                    sx={{
                                        width: '50',
                                        minWidth: '20px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent !important',
                                        },
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '.MuiSelect-select': {
                                            padding: '4px 8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'black',
                                            marginRight: '-4px',
                                        },
                                        '& .MuiSelect-select.MuiSelect-select': {
                                            color: 'white',
                                        },
                                        backgroundColor: 'transparent',
                                    }}
                                    MenuProps={{
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        },
                                        transformOrigin: {
                                            vertical: 'top',
                                            horizontal: 'left',
                                        },
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                color: 'white',
                                                backdropFilter: 'blur(5px)',
                                            }
                                        }
                                    }}
                                >
                                    {partidas.map((partida) => (
                                        <MenuItem
                                            key={partida.id}
                                            value={partida.id}
                                            disabled={partida.membros.length >= partida.capacidadeMaximaJogadores}
                                            sx={{
                                                backgroundColor: 'transparent',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                },
                                                '&.Mui-disabled': {
                                                    opacity: 0.6,
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                }
                                            }}
                                        >
                                            {partida.nome} ({partida.membros.length}/{partida.capacidadeMaximaJogadores})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </TableContainer>
);