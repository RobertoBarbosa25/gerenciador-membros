import { Partida } from '../Types/Rank';
declare const vigiliaApi: {
    getSalas: () => Promise<Partida[]>;
    resetarTodasSalas: () => Promise<void>;
    adicionarMembroASala: (salaId: number, membroId: number) => Promise<Partida>;
    removerMembroDaSala: (salaId: number, membroId: number) => Promise<Partida>;
    resetarSala: (salaId: number) => Promise<void>;
};
export default vigiliaApi;
