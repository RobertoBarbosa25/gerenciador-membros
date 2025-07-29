export type MemberClass = "Arcanista" | "Bárbaro" | "Cavaleiro de Sangue" | "Cruzado" | "Caçador de Demônios" | "Necromante" | "Tempestário" | "Monge" | "Druida";
export type Cla = "Chernobyl" | "Maktub" | "WarLords" | "Arkyn";
export interface Player {
    id: number;
    name: string;
    resonance: number;
    memberClass: MemberClass;
    phone: string;
    discordId: string;
    cla: Cla;
}
export interface Partida {
    id: number;
    nome: string;
    capacidadeMaximaJogadores: number;
    membros: Player[];
}
