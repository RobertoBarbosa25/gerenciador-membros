import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm, isResettingAllRooms = false, isResettingRoom = null, }) => (_jsxs(Dialog, { open: open, onClose: onCancel, "aria-labelledby": "confirm-dialog-title", "aria-describedby": "confirm-dialog-description", PaperProps: {
        sx: {
            backgroundColor: 'rgba(30, 40, 50, 0.95)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.2)'
        }
    }, children: [_jsx(DialogTitle, { id: "confirm-dialog-title", sx: { color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1.5 }, children: title }), _jsx(DialogContent, { sx: { pt: 2, pb: 3 }, children: _jsx(Typography, { id: "confirm-dialog-description", sx: { color: 'rgba(255, 255, 255, 0.8)' }, children: message }) }), _jsxs(DialogActions, { sx: { borderTop: '1px solid rgba(255,255,255,0.1)', pt: 1.5, justifyContent: 'space-around' }, children: [_jsx(Button, { onClick: onCancel, variant: "outlined", color: "info", sx: { px: 3, py: 1 }, children: "Cancelar" }), _jsx(Button, { onClick: onConfirm, variant: "contained", color: "error", autoFocus: true, sx: { px: 3, py: 1 }, disabled: isResettingAllRooms || !!isResettingRoom, children: (isResettingAllRooms || isResettingRoom) ? _jsx(CircularProgress, { size: 20, color: "inherit" }) : "Confirmar" })] })] }));
