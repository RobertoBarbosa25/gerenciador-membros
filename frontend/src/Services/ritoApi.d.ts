import { Partida } from '../Types/Rank';
declare const ritoApi: {
    getPartidas: () => Promise<Partida[]>;
    inicializarPartidasBackend: () => Promise<string>;
    addMembroToPartida: (partidaId: number, membroId: number) => Promise<Partida>;
    removeMembroFromPartida: (partidaId: number, membroId: number) => Promise<Partida>;
    updatePartidaName: (partidaId: number, newName: string) => Promise<Partida>;
};
export default ritoApi;
