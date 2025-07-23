import { Player, Partida } from '../../Types/Rank';

export interface RoomHeaderProps {
  isEditing: boolean;
  name: string;
  membersCount: number;
  maxMembers: number;
  editingName: string;
  onEdit: () => void;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  isSavingName?: boolean;
}

export interface RoomMembersTableProps {
  membros: Player[];
  partidas: Partida[];
  partidaId: number;
  getClassBackgroundColor: (memberClass: string) => string;
  translateClass: (memberClass: string) => string;
  highlightedRow: number | null;
  highlightType: 'green' | 'red' | null;
  movePlayerToRoom: (player: Player, currentPartidaId: number, targetPartidaId: number) => void;
  loadingPlayerId?: number | null;
}

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  isResettingAllRooms?: boolean;
  isResettingRoom?: number | null;
}; 