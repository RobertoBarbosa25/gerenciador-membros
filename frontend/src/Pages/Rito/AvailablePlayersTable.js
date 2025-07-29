import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Tooltip, Typography } from '@mui/material';
export const AvailablePlayersTable = ({ availablePlayers, partidas, isLoading, movePlayerToRoom, getClassBackgroundColor, translateClass, }) => (_jsx(TableContainer, { component: Paper, sx: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '0 0 8px 8px',
    }, children: _jsxs(Table, { stickyHeader: true, sx: {
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
        }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nome" }), _jsx(TableCell, { children: "Ress" }), _jsx(TableCell, { children: "Classe" }), _jsx(TableCell, { children: "Cla" }), _jsx(TableCell, { sx: { textAlign: 'right' }, children: "Mover" })] }) }), _jsx(TableBody, { children: isLoading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", children: _jsx(Typography, { sx: { color: 'white' }, children: "Carregando membros..." }) }) })) : availablePlayers.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", sx: { borderBottom: 'none', py: 3 }, children: _jsx(Typography, { variant: "body1", sx: { color: 'rgba(255, 255, 255, 0.7)' }, children: "Nenhum membro dispon\u00EDvel." }) }) })) : (availablePlayers.map((player, idx) => (_jsxs(TableRow, { sx: { backgroundColor: getClassBackgroundColor(player.memberClass) }, children: [_jsx(TableCell, { sx: { maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: _jsx(Tooltip, { title: player.name, placement: "top", arrow: true, children: _jsx(Typography, { sx: { color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: player.name }) }) }), _jsx(TableCell, { children: player.resonance }), _jsx(TableCell, { children: translateClass(player.memberClass) }), _jsx(TableCell, { children: player.cla }), _jsx(TableCell, { sx: { textAlign: 'right' }, children: _jsx(Select, { value: '', onChange: (e) => {
                                    const targetId = Number(e.target.value);
                                    if (!isNaN(targetId)) {
                                        movePlayerToRoom(player, null, targetId);
                                    }
                                }, displayEmpty: true, size: "small", sx: {
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
                                }, MenuProps: {
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
                                }, children: partidas.map((partida) => (_jsxs(MenuItem, { value: partida.id, disabled: partida.membros.length >= partida.capacidadeMaximaJogadores, sx: {
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
                                    }, children: [partida.nome, " (", partida.membros.length, "/", partida.capacidadeMaximaJogadores, ")"] }, partida.id))) }) })] }, `${player.id}-${idx}`)))) })] }) }));
