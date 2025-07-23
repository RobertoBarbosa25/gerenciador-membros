import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography, Select, MenuItem, CircularProgress, Avatar, Tooltip, LinearProgress, Badge } from '@mui/material';
import { Player, Partida } from '../../../Types/Rank';
import { AnimatedTableRow } from '../Rito';
import { RoomMembersTableProps } from '../Rito.types';

export const RoomMembersTable: React.FC<RoomMembersTableProps> = ({
  membros,
  partidas,
  partidaId,
  getClassBackgroundColor,
  translateClass,
  highlightedRow,
  highlightType,
  movePlayerToRoom,
  loadingPlayerId = null,
}) => {
  return (
    <TableContainer component={Paper} sx={{
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      borderRadius: '0 0 12px 12px',
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
            <TableCell sx={{ textAlign: 'right' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {membros.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ borderBottom: 'none', py: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Nenhum membro nesta sala.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            membros.map((membro, idx) => {
              const partidaIds = partidas.map(p => p.id);
              const selectValue = partidaIds.includes(partidaId) ? partidaId : '';
              return (
                <AnimatedTableRow
                  key={membro.id}
                  className={highlightedRow === membro.id ? `highlight-${highlightType}` : ''}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(97, 218, 251, 0.08) !important',
                    },
                  }}
                >
                  <TableCell>
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{membro.name}</span>
                  </TableCell>
                  <TableCell>{membro.resonance}</TableCell>
                  <TableCell>{translateClass(membro.memberClass)}</TableCell>
                  <TableCell>{membro.cla}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Select
                        value={selectValue}
                        onChange={(e) => {
                          const targetId = Number(e.target.value);
                          if (!isNaN(targetId) && targetId !== partidaId) {
                            movePlayerToRoom(membro, partidaId, targetId);
                          }
                        }}
                        size="small"
                        aria-label={`Mover ou remover jogador ${membro.name}`}
                        sx={{
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
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              color: 'white',
                              backdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                            },
                          },
                        }}
                        renderValue={(selectedId) => {
                          const currentPartida = partidas.find(p => p.id === selectedId);
                          return currentPartida ? currentPartida.nome : 'N/A';
                        }}
                        disabled={loadingPlayerId === membro.id}
                      >
                        <MenuItem value={partidaId} disabled>
                          {partidas.find(p => p.id === partidaId)?.nome || 'Sala atual'}
                        </MenuItem>
                        {partidas
                          .filter(p => p.id !== partidaId)
                          .map((p) => (
                            <MenuItem
                              key={p.id}
                              value={p.id}
                              disabled={p.membros.length >= p.capacidadeMaximaJogadores}
                            >
                              {p.nome}
                            </MenuItem>
                          ))}
                        <MenuItem value={0}>
                          Remover da Sala
                        </MenuItem>
                      </Select>
                    </Box>
                  </TableCell>
                </AnimatedTableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoomMembersTable; 