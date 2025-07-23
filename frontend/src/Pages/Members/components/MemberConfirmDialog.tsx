import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface MemberConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const MemberConfirmDialog: React.FC<MemberConfirmDialogProps> = ({ open, title, message, confirmButtonText, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} color="error" variant="contained">{confirmButtonText}</Button>
    </DialogActions>
  </Dialog>
); 