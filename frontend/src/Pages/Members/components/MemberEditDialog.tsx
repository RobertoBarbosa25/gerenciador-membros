import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Player } from '../../../Types/Rank.types';
import { CLASS_OPTIONS, CLA_OPTIONS } from '../../../Types/Rank.constants';
import { textFieldDarkStyle, selectDarkStyle, saveButtonStyle, cancelButtonStyle } from '../Members.style';

const selectDialogDarkStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(30,30,30,0.95)',
    color: 'white',
    '& fieldset': {
      borderColor: '#61dafb',
    },
    '&:hover fieldset': {
      borderColor: '#61dafb',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#61dafb',
    },
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiSelect-select': {
    paddingTop: '8.5px !important',
    paddingBottom: '8.5px !important',
    minHeight: 'unset',
    backgroundColor: 'rgba(30,30,30,0.95)',
  },
  minWidth: '110px',
};

interface MemberEditDialogProps {
  open: boolean;
  tempPlayer: Player | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const MemberEditDialog: React.FC<MemberEditDialogProps> = ({ open, tempPlayer, onChange, onSave, onCancel }) => {
  if (!tempPlayer) return null;
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        background: 'rgba(30, 32, 36, 0.98)',
        color: 'white',
        borderRadius: 3,
        border: '2px solid #61dafb',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.65)',
        p: 0,
      }
    }}>
      <DialogTitle sx={{ color: '#61dafb', fontWeight: 'bold', textAlign: 'center', fontSize: '1.3rem', letterSpacing: 1, background: 'rgba(30,32,36,0.95)', borderRadius: '12px 12px 0 0', borderBottom: '1px solid #222', py: 2 }}>Editar Membro</DialogTitle>
      <DialogContent sx={{
        background: 'rgba(36, 38, 43, 0.98)',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        p: 3,
        borderBottom: '1px solid #222',
      }}>
        <TextField
          margin="dense"
          label="Nome"
          name="name"
          value={tempPlayer.name}
          onChange={onChange}
          fullWidth
          sx={textFieldDarkStyle}
          InputLabelProps={{ sx: { color: '#aaa' } }}
        />
        <TextField
          margin="dense"
          label="Ressonância"
          name="resonance"
          type="number"
          value={tempPlayer.resonance}
          onChange={onChange}
          fullWidth
          sx={textFieldDarkStyle}
          InputLabelProps={{ sx: { color: '#aaa' } }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel sx={{ color: '#aaa' }}>Classe</InputLabel>
          <Select
            name="memberClass"
            value={tempPlayer.memberClass}
            onChange={onChange}
            label="Classe"
            sx={selectDarkStyle}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'rgba(20, 22, 25, 0.98)',
                  color: 'white',
                },
              },
            }}
          >
            {CLASS_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel sx={{ color: '#aaa' }}>Clã</InputLabel>
          <Select
            name="cla"
            value={tempPlayer.cla}
            onChange={onChange}
            label="Clã"
            sx={selectDarkStyle}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'rgba(20, 22, 25, 0.98)',
                  color: 'white',
                },
              },
            }}
          >
            {CLA_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Telefone"
          name="phone"
          value={tempPlayer.phone}
          onChange={onChange}
          fullWidth
          sx={textFieldDarkStyle}
          InputLabelProps={{ sx: { color: '#aaa' } }}
        />
        <TextField
          margin="dense"
          label="Discord"
          name="discordId"
          value={tempPlayer.discordId}
          onChange={onChange}
          fullWidth
          sx={textFieldDarkStyle}
          InputLabelProps={{ sx: { color: '#aaa' } }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2, background: 'rgba(30,32,36,0.95)' }}>
        <Button onClick={onCancel} sx={cancelButtonStyle}>Cancelar</Button>
        <Button onClick={onSave} variant="contained" sx={saveButtonStyle}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}; 