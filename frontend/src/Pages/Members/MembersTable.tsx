import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Tooltip,
  Skeleton,
  TextField,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Player } from '../../Types/Rank.types';
import { CLASS_OPTIONS, CLA_OPTIONS } from '../../Types/Rank.constants';
import {
  classHeaderCellStyle,
  resonanceHeaderCellStyle,
  baseTableCellSx,
  classCellStyles,
  resonanceCellStyles,
  classColors,
  classSelectFormControlStyle,
  claSelectFormControlStyle,
  textFieldDarkStyle,
  selectDarkStyle,
  saveButtonStyle,
  cancelButtonStyle,
} from './Members.style';
import { SelectChangeEvent } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { translateClass } from '../../Utils';

export type MembersTableProps = {
  players: Player[];
  editingPlayerId: number | null;
  tempPlayer: Player | null;
  highlightedRow: number | null;
  highlightType: 'green' | 'red' | null;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  onSave: () => void;
  onCancel: () => void;
  disableActions?: boolean;
  isLoading: boolean;
  orderBy: keyof Player;
  order: 'asc' | 'desc';
  handleSortRequest: (property: 'name' | 'memberClass' | 'resonance') => void;
};

export const MembersTable: React.FC<MembersTableProps> = ({
  players,
  editingPlayerId,
  tempPlayer,
  highlightedRow,
  highlightType,
  onEdit,
  onRemove,
  onChange,
  onSave,
  onCancel,
  disableActions,
  isLoading,
  orderBy,
  order,
  handleSortRequest,
}) => {
  // Removido handlePageChange e setPage
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: { xs: '40vh', md: '60vh' },
        overflowY: 'auto',
        overflowX: 'auto',
        backgroundColor: '#23272f', // fundo escuro
        mb: 2,
        borderRadius: 2,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
        width: '100%',
        minWidth: 1000,
        maxWidth: '100%',
      }}
    >
      <Table stickyHeader sx={{ width: '100%', minWidth: 1000, backgroundColor: '#23272f', tableLayout: 'fixed' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'left', width: 220 }}>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleSortRequest('name')}
                sx={{ color: 'white', '&.Mui-active': { color: '#61dafb' } }}
              >
                Nome
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'center', width: 80, verticalAlign: 'middle' }}>
              <TableSortLabel
                active={orderBy === 'memberClass'}
                direction={orderBy === 'memberClass' ? order : 'asc'}
                onClick={() => handleSortRequest('memberClass')}
                sx={{ color: 'white', '&.Mui-active': { color: '#61dafb' } }}
              >
                Classe
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'center', width: 110, pl: 2 }}>
              <TableSortLabel
                active={orderBy === 'resonance'}
                direction={orderBy === 'resonance' ? order : 'asc'}
                onClick={() => handleSortRequest('resonance')}
                sx={{ color: 'white', '&.Mui-active': { color: '#61dafb' } }}
              >
                Ressonância
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'center', width: 180, verticalAlign: 'middle' }}>Telefone</TableCell>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'center', width: 120, verticalAlign: 'middle' }}>Discord</TableCell>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'center', width: 120 }}>Clã</TableCell>
            <TableCell sx={{ ...classHeaderCellStyle, textAlign: 'right', width: 90 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, idx) => (
              <TableRow key={idx}>
                {[...Array(7)].map((__, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton variant="rectangular" height={32} animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : players.length > 0 ? (
            players.map((player) => (
              editingPlayerId === player.id ? (
                <TableRow key={player.id}>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'left' }}>
                    <TextField
                      name="name"
                      value={tempPlayer?.name || ''}
                      onChange={onChange}
                      size="small"
                      fullWidth
                      sx={textFieldDarkStyle}
                    />
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center' }}>
                    <Select
                      name="memberClass"
                      value={tempPlayer?.memberClass || ''}
                      onChange={(e) => onChange(e as SelectChangeEvent)}
                      size="small"
                      fullWidth
                      sx={selectDarkStyle}
                    >
                      {CLASS_OPTIONS.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center' }}>
                    <TextField
                      name="resonance"
                      type="number"
                      value={tempPlayer?.resonance || 0}
                      onChange={onChange}
                      size="small"
                      fullWidth
                      sx={textFieldDarkStyle}
                    />
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'left' }}>
                    <TextField
                      name="phone"
                      value={tempPlayer?.phone || ''}
                      onChange={onChange}
                      size="small"
                      fullWidth
                      sx={textFieldDarkStyle}
                    />
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'left' }}>
                    <TextField
                      name="discordId"
                      value={tempPlayer?.discordId || ''}
                      onChange={onChange}
                      size="small"
                      fullWidth
                      sx={textFieldDarkStyle}
                    />
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center' }}>
                    <Select
                      name="cla"
                      value={tempPlayer?.cla || ''}
                      onChange={(e) => onChange(e as SelectChangeEvent)}
                      size="small"
                      fullWidth
                      sx={selectDarkStyle}
                    >
                      {CLA_OPTIONS.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'right' }}>
                    <Tooltip title="Salvar">
                      <span>
                        <IconButton onClick={onSave} disabled={disableActions}>
                          <span role="img" aria-label="salvar">💾</span>
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <span>
                        <IconButton onClick={onCancel} disabled={disableActions}>
                          <span role="img" aria-label="cancelar">❌</span>
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow
                  key={player.id}
                  sx={{
                    backgroundColor:
                      highlightedRow === player.id && highlightType === 'green'
                        ? classColors.green
                        : highlightedRow === player.id && highlightType === 'red'
                        ? classColors.red
                        : 'transparent',
                  }}
                >
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'left', maxWidth: 220, width: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }}>
                    <span style={{ display: 'block', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {player.name.length > 8 ? player.name.slice(0, 8) + '…' : player.name}
                    </span>
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center', width: 80, verticalAlign: 'middle', maxWidth: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'table-cell' }}>{translateClass(player.memberClass)}</TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center', width: 110, pl: 2 }}>{player.resonance}</TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center', verticalAlign: 'middle', width: 180, pl: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      {player.phone && (
                        <a
                          href={`https://wa.me/+55${player.phone.replace(/\D/g, '')}?text=Falaaaa, aqui é um dos adms da Chernobyl, só passando para adiciona-lo aos amigos. Seja bem vindo(a) ${player.name}!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#25D366', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}
                        >
                          <WhatsAppIcon sx={{ fontSize: '1.5rem', color: '#25D366', mr: 0.5 }} />
                        </a>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center', width: 120, verticalAlign: 'middle' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      {player.discordId}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'center', width: 120 }}>{player.cla}</TableCell>
                  <TableCell sx={{ ...baseTableCellSx, textAlign: 'right', width: 90 }}>
                    <Tooltip title="Editar">
                      <span>
                        <IconButton onClick={() => onEdit(player.id)} disabled={disableActions} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <span>
                        <IconButton onClick={() => onRemove(player.id)} disabled={disableActions} sx={{ color: '#f44336' }}>
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ color: 'white', backgroundColor: '#333' }}>
                <InfoOutlinedIcon sx={{ fontSize: 32, color: '#61dafb', mb: 1 }} />
                <div>Nenhum membro encontrado com os filtros atuais.</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 