import { useState } from 'react';
import membrosApi from '../../../Services/membrosApi';

export function useMemberRemove(onRemoveSuccess: () => void) {
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmButtonText, setConfirmButtonText] = useState('');

  const openConfirmation = (id: number) => {
    setRemovingId(id);
    setConfirmTitle('Confirmar Remoção');
    setConfirmMessage('Tem certeza que deseja remover este membro? Esta ação é irreversível.');
    setConfirmButtonText('Remover');
    setConfirmAction(() => () => handleRemove(id));
    setConfirmOpen(true);
  };

  const handleRemove = async (id: number) => {
    setLoading(true);
    try {
      await membrosApi.deleteMembro(id);
      onRemoveSuccess();
      setConfirmOpen(false);
    } finally {
      setLoading(false);
      setRemovingId(null);
    }
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setRemovingId(null);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
  };

  return {
    removingId,
    loading,
    confirmOpen,
    confirmTitle,
    confirmMessage,
    confirmButtonText,
    openConfirmation,
    handleCloseConfirm,
    handleConfirmAction,
  };
} 