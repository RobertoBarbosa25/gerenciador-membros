import { Player } from "../../Types/Rank";
import { toast } from 'react-toastify';

export const MAX_ATTACK_PLAYERS = 10;
export const MAX_DEFENSE_PLAYERS = 10;

export const movePlayer = (
  source: { droppableId: string; index: number; },
  destination: { droppableId: string; index: number; },
  _movedPlayer: Player,
  allPlayers: Player[],
  setAllPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  attackTower: Player[],
  setAttackTower: React.Dispatch<React.SetStateAction<Player[]>>,
  defenseTower: Player[],
  setDefenseTower: React.Dispatch<React.SetStateAction<Player[]>>
) => {
  let sourcePlayers: Player[] = [];

  // Identifica a lista de origem
  switch (source.droppableId) {
    case 'allPlayers':
      sourcePlayers = allPlayers;
      break;
    case 'attackTower':
      sourcePlayers = attackTower;
      break;
    case 'defenseTower':
      sourcePlayers = defenseTower;
      break;
    default:
      return;
  }

  // Remove o jogador da lista de origem
  const updatedSourcePlayers = [...sourcePlayers];
  const movedPlayerObj = updatedSourcePlayers.splice(source.index, 1)[0];

  // Se a origem e o destino forem a mesma lista
  if (source.droppableId === destination.droppableId) {
    updatedSourcePlayers.splice(destination.index, 0, movedPlayerObj);

    // Atualiza a lista de origem
    switch (source.droppableId) {
      case 'allPlayers':
        setAllPlayers(updatedSourcePlayers);
        break;
      case 'attackTower':
        setAttackTower(updatedSourcePlayers);
        localStorage.setItem('attackTower', JSON.stringify(updatedSourcePlayers));
        break;
      case 'defenseTower':
        setDefenseTower(updatedSourcePlayers);
        localStorage.setItem('defenseTower', JSON.stringify(updatedSourcePlayers));
        break;
      default:
        return;
    }
    return; // Sai da função já que a atualização foi feita
  }

  // Adiciona o jogador à lista de destino
  switch (destination.droppableId) {
    case 'allPlayers':
      setAllPlayers((prev) => {
        const newAllPlayers = [...prev];
        newAllPlayers.splice(destination.index, 0, movedPlayerObj);
        return newAllPlayers;
      });
      break;
    case 'attackTower':
      if (attackTower.length >= MAX_ATTACK_PLAYERS) {
        console.log("Limite de jogadores na Torre de Ataque atingido.");
        toast.error("Limite de jogadores na Torre de Ataque atingido.");
        return; // Não adiciona se o limite for atingido
      }
      {
        const newAttackTower = [...attackTower];
        newAttackTower.splice(destination.index, 0, movedPlayerObj);
        setAttackTower(newAttackTower);
        localStorage.setItem('attackTower', JSON.stringify(newAttackTower));
        break;
      }
    case 'defenseTower':
      if (defenseTower.length >= MAX_DEFENSE_PLAYERS) {
        console.log("Limite de jogadores na Torre de Defesa atingido.");
        toast.error("Limite de jogadores na Torre de Defesa atingido.");
        return; // Não adiciona se o limite for atingido
      }
      {
        const newDefenseTower = [...defenseTower];
        newDefenseTower.splice(destination.index, 0, movedPlayerObj);
        setDefenseTower(newDefenseTower);
        localStorage.setItem('defenseTower', JSON.stringify(newDefenseTower));
        break;
      }
    default:
      return;
  }

  // Atualiza a lista de origem
  if (source.droppableId === 'allPlayers') {
    setAllPlayers(updatedSourcePlayers);
  } else if (source.droppableId === 'attackTower') {
    setAttackTower(updatedSourcePlayers);
    localStorage.setItem('attackTower', JSON.stringify(updatedSourcePlayers));
  } else if (source.droppableId === 'defenseTower') {
    setDefenseTower(updatedSourcePlayers);
    localStorage.setItem('defenseTower', JSON.stringify(updatedSourcePlayers));
  }
};

export const normalizeString = (str: string) => {
  const normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normalized.replace(/\s+/g, '').toLowerCase();
}
