import React from 'react';
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
export declare const ConfirmDialog: React.FC<ConfirmDialogProps>;
export {};
