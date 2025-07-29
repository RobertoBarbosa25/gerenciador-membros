import { Player } from '../Types/Rank';
declare const membrosApi: {
    getMembros: (filters?: {
        name?: string;
        memberClass?: string;
        cla?: string;
    }, signal?: AbortSignal) => Promise<Player[]>;
    createMembro: (membro: Omit<Player, "id">) => Promise<Player>;
    updateMembro: (id: number, membro: Player) => Promise<Player>;
    deleteMembro: (id: number) => Promise<void>;
    importMembrosBatch: (membros: Omit<Player, "id">[]) => Promise<{
        successCount: number;
        skippedCount: number;
        errorCount: number;
        successNames: string[];
        skippedNames: string[];
        errorMessages: string[];
    }>;
    deleteAllMembros: () => Promise<void>;
};
export default membrosApi;
