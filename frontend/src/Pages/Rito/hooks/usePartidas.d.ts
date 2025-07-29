import { Player } from '../../../Types/Rank.types';
type Partida = {
    id: number;
    nome: string;
    membros: Player[];
    capacidadeMaximaJogadores: number;
    tipo?: string;
};
export declare function usePartidas(): {
    partidas: Partida[];
    setPartidas: import("react").Dispatch<import("react").SetStateAction<Partida[]>>;
    isLoadingPartidas: boolean;
    fetchPartidas: () => Promise<void>;
    updatePartidaName: (partidaId: number, newName: string) => Promise<void>;
};
export {};
