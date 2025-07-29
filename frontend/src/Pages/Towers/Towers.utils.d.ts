import { Player } from "../../Types/Rank";
export declare const MAX_ATTACK_PLAYERS = 10;
export declare const MAX_DEFENSE_PLAYERS = 10;
export declare const movePlayer: (source: {
    droppableId: string;
    index: number;
}, destination: {
    droppableId: string;
    index: number;
}, _movedPlayer: Player, allPlayers: Player[], setAllPlayers: React.Dispatch<React.SetStateAction<Player[]>>, attackTower: Player[], setAttackTower: React.Dispatch<React.SetStateAction<Player[]>>, defenseTower: Player[], setDefenseTower: React.Dispatch<React.SetStateAction<Player[]>>) => void;
export declare const normalizeString: (str: string) => string;
