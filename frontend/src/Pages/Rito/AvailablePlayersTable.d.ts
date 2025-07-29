import React from 'react';
type Player = {
    id: number;
    name: string;
    resonance: number;
    memberClass: "Arcanista" | "Bárbaro" | "Cavaleiro de Sangue" | "Cruzado" | "Caçador de Demônios" | "Necromante" | "Tempestário" | "Monge" | "Druida";
    phone: string;
    discordId: string;
    cla: "Chernobyl" | "Maktub" | "Warlords" | "Arkyn";
};
type Partida = {
    id: number;
    nome: string;
    membros: Player[];
    capacidadeMaximaJogadores: number;
};
type Props = {
    availablePlayers: Player[];
    partidas: Partida[];
    isLoading: boolean;
    movePlayerToRoom: (player: Player, currentPartidaId: number | null, targetPartidaId: number) => void;
    getClassBackgroundColor: (memberClass: string) => string;
    translateClass: (memberClass: string) => string;
};
export declare const AvailablePlayersTable: React.FC<Props>;
export {};
