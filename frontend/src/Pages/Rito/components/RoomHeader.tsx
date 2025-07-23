import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Save, Edit, Recycling } from '@mui/icons-material';
import { WhiteTextField } from '../Rito.styles';
import { RoomHeaderProps } from '../Rito.types';

const RoomHeader: React.FC<RoomHeaderProps> = ({
  isEditing,
  name,
  membersCount,
  maxMembers,
  editingName,
  onEdit,
  onChangeName,
  onSave,
  onCancel,
  onReset,
  isSavingName = false,
}) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 2,
    gap: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // sombra sutil
    position: 'sticky',
    top: 0,
    zIndex: 2,
  }}>
    {isEditing ? (
      <>
        <WhiteTextField
          value={editingName}
          onChange={onChangeName}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, mr: 1 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onSave}
          sx={{ minWidth: 'auto', px: 1, py: 0.5, whiteSpace: 'nowrap' }}
          title="Salvar Nome"
          aria-label="Salvar nome da sala"
          disabled={isSavingName}
        >
          {isSavingName ? <CircularProgress size={20} color="inherit" /> : <Save fontSize="small" />}
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={onCancel}
          sx={{ minWidth: 'auto', px: 1, py: 0.5, whiteSpace: 'nowrap' }}
          title="Cancelar Edição"
          aria-label="Cancelar edição do nome da sala"
        >
          Cancelar
        </Button>
      </>
    ) : (
      <>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexGrow: 1,
          }}
        >
          {name} ({membersCount}/{maxMembers} jogadores)
        </Typography>
        <Button
          variant="text"
          color="info"
          onClick={onEdit}
          sx={{ minWidth: 'auto', p: 0.5, mr: 1 }}
          title="Editar Nome da Sala"
          aria-label="Editar nome da sala"
        >
          <Edit fontSize="small" />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onReset}
          sx={{ minWidth: 'auto', px: 1, py: 1 }}
          title="Resetar Sala"
          aria-label="Resetar sala"
        >
          <Recycling fontSize="small" />
        </Button>
      </>
    )}
  </Box>
);

export default RoomHeader; 