import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import { ConfirmDialogProps } from '../Rito.types';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  isResettingAllRooms?: boolean;
  isResettingRoom?: number | null;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  isResettingAllRooms = false,
  isResettingRoom = null,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="confirm-dialog-title"
    aria-describedby="confirm-dialog-description"
    PaperProps={{
      sx: {
        backgroundColor: 'rgba(30, 40, 50, 0.95)',
        color: 'white',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
        border: '1px solid rgba(255,255,255,0.2)'
      }
    }}
  >
    <DialogTitle id="confirm-dialog-title" sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1.5 }}>
      {title}
    </DialogTitle>
    <DialogContent sx={{ pt: 2, pb: 3 }}>
      <Typography id="confirm-dialog-description" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 1.5, justifyContent: 'space-around' }}>
      <Button onClick={onCancel} variant="outlined" color="info" sx={{ px: 3, py: 1 }}>
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
        autoFocus
        sx={{ px: 3, py: 1 }}
        disabled={isResettingAllRooms || !!isResettingRoom}
      >
        {(isResettingAllRooms || isResettingRoom) ? <CircularProgress size={20} color="inherit" /> : "Confirmar"}
      </Button>
    </DialogActions>
  </Dialog>
); 