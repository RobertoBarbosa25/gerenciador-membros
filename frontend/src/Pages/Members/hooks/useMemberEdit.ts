import { useState } from 'react';
import { Player } from '../../../Types/Rank.types';
import membrosApi from '../../../Services/membrosApi';

export function useMemberEdit(players: Player[], onEditSuccess: () => void) {
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [tempPlayer, setTempPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (id: number) => {
    const playerToEdit = players.find(player => player.id === id);
    if (playerToEdit) {
      setEditingPlayerId(id);
      setTempPlayer({ ...playerToEdit });
    }
  };

  const handleSaveEdit = async () => {
    if (tempPlayer && editingPlayerId !== null) {
      setLoading(true);
      try {
        await membrosApi.updateMembro(editingPlayerId, tempPlayer);
        setEditingPlayerId(null);
        setTempPlayer(null);
        onEditSuccess();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setTempPlayer(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    if (tempPlayer) {
      const { name, value } = e.target;
      setTempPlayer(prev => ({
        ...prev!,
        [name]: name === 'resonance' ? parseFloat(value as string) : value,
      }));
    }
  };

  return {
    editingPlayerId,
    tempPlayer,
    loading,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleChange,
  };
} 