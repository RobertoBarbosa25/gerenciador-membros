import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography, Select, MenuItem } from '@mui/material';
import { AnimatedTableRow } from '../Rito';
export const RoomMembersTable = ({ membros, partidas, partidaId, getClassBackgroundColor, translateClass, highlightedRow, highlightType, movePlayerToRoom, loadingPlayerId = null, }) => {
    return (_jsx(TableContainer, { component: Paper, sx: {
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderRadius: '0 0 12px 12px',
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
            }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nome" }), _jsx(TableCell, { children: "Ress" }), _jsx(TableCell, { children: "Classe" }), _jsx(TableCell, { children: "Cla" }), _jsx(TableCell, { sx: { textAlign: 'right' }, children: "A\u00E7\u00F5es" })] }) }), _jsx(TableBody, { children: membros.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, align: "center", sx: { borderBottom: 'none', py: 3 }, children: _jsx(Typography, { variant: "body2", sx: { color: 'rgba(255, 255, 255, 0.7)' }, children: "Nenhum membro nesta sala." }) }) })) : (membros.map((membro, idx) => {
                        const partidaIds = partidas.map(p => p.id);
                        const selectValue = partidaIds.includes(partidaId) ? partidaId : '';
                        return (_jsxs(AnimatedTableRow, { className: highlightedRow === membro.id ? `highlight-${highlightType}` : '', sx: {
                                backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                                transition: 'background-color 0.2s',
                                '&:hover': {
                                    backgroundColor: 'rgba(97, 218, 251, 0.08) !important',
                                },
                            }, children: [_jsx(TableCell, { children: _jsx("span", { style: { fontWeight: 600, fontSize: '1.05rem' }, children: membro.name }) }), _jsx(TableCell, { children: membro.resonance }), _jsx(TableCell, { children: translateClass(membro.memberClass) }), _jsx(TableCell, { children: membro.cla }), _jsx(TableCell, { sx: { textAlign: 'right' }, children: _jsx(Box, { sx: { display: 'flex', gap: 1, justifyContent: 'flex-end' }, children: _jsxs(Select, { value: selectValue, onChange: (e) => {
                                                const targetId = Number(e.target.value);
                                                if (!isNaN(targetId) && targetId !== partidaId) {
                                                    movePlayerToRoom(membro, partidaId, targetId);
                                                }
                                            }, size: "small", "aria-label": `Mover ou remover jogador ${membro.name}`, sx: {
                                                width: '120px',
                                                height: '32px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                transition: 'background-color 0.2s, border-color 0.2s',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                    borderWidth: '1px',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white',
                                                },
                                                '.MuiSelect-select': {
                                                    color: 'black',
                                                    padding: '3px 8px',
                                                    minHeight: 'auto',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: 'black',
                                                    fontSize: '1.2rem',
                                                },
                                            }, MenuProps: {
                                                PaperProps: {
                                                    sx: {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        color: 'white',
                                                        backdropFilter: 'blur(5px)',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                    },
                                                },
                                            }, renderValue: (selectedId) => {
                                                const currentPartida = partidas.find(p => p.id === selectedId);
                                                return currentPartida ? currentPartida.nome : 'N/A';
                                            }, disabled: loadingPlayerId === membro.id, children: [_jsx(MenuItem, { value: partidaId, disabled: true, children: partidas.find(p => p.id === partidaId)?.nome || 'Sala atual' }), partidas
                                                    .filter(p => p.id !== partidaId)
                                                    .map((p) => (_jsx(MenuItem, { value: p.id, disabled: p.membros.length >= p.capacidadeMaximaJogadores, children: p.nome }, p.id))), _jsx(MenuItem, { value: 0, children: "Remover da Sala" })] }) }) })] }, membro.id));
                    })) })] }) }));
};
export default RoomMembersTable;
