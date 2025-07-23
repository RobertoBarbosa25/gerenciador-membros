// src/Pages/Register/Register.utils.ts

import membrosApi from '../../Services/membrosApi';
import { Player } from '../../Types/Rank';

type ShowSnackbarFn = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;

export const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    showSnackbar: ShowSnackbarFn,
    onUploadComplete?: () => void
) => {
    const file = event.target.files?.[0];

    if (!file) {
        showSnackbar("Nenhum arquivo selecionado.", "warning");
        return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            showSnackbar("O arquivo CSV está vazio.", "warning");
            return;
        }

        // Pular a primeira linha (geralmente o cabeçalho)
        // Se o seu CSV do Google Forms tem um cabeçalho na primeira linha (ex: "Carimbo de data/hora,Nome,..."),
        // a linha `lines.slice(1)` abaixo o removerá.
        const dataLines = lines.slice(1);

        if (dataLines.length === 0) {
            showSnackbar("O arquivo CSV não contém dados após o cabeçalho.", "warning");
            return;
        }

        let successCount = 0;
        let newCount = 0;
        let updateCount = 0;
        let errorCount = 0;

        for (const line of dataLines) {
            const columns = line.split(',');

            // --- CORREÇÃO CRÍTICA: Mapeamento de Colunas Ajustado ---
            // Ignorando columns[0] (Timestamp) e pegando os dados a partir de columns[1]
            const name = columns[1]?.trim();                 // Nome agora é o índice [1]
            const memberClass = columns[2]?.trim() as Player['memberClass']; // Classe é o índice [2]
            const resonance = parseFloat(columns[3]?.trim() || '0'); // Ressonância é o índice [3]
            const phone = columns[4]?.trim();                // Telefone é o índice [4]
            const discordId = columns[5]?.trim();            // Discord ID é o índice [5]
            const cla = columns[6]?.trim() as Player['cla']; // Clã é o índice [6]
            // --- FIM DA CORREÇÃO ---

            // Console.log para depuração: Verifique os valores após o mapeamento
            console.log("Valores processados para a linha:", { name, memberClass, resonance, phone, discordId, cla });

            // Validação: Garante que os campos obrigatórios não estão vazios/inválidos
            if (!name || isNaN(resonance) || !memberClass || !cla) {
                console.warn(`Linha ignorada devido a dados incompletos ou inválidos: ${line}`);
                errorCount++;
                continue;
            }

            const newPlayerPartial: Omit<Player, 'id'> = {
                name,
                resonance,
                memberClass,
                phone: phone || '', // Garante string vazia se nulo/undefined
                discordId: discordId || '', // Garante string vazia se nulo/undefined
                cla,
            };

            try {
                await membrosApi.createMembro(newPlayerPartial);
                newCount++;
                successCount++;
            } catch (createError: any) {
                console.error(`Erro ao processar jogador ${name}:`, createError);
                errorCount++;
            }
        }

        if (successCount > 0) {
            showSnackbar(`Importação concluída! ${newCount} novos membros cadastrados, ${errorCount} erros.`, "success");
        } else if (errorCount > 0) {
            showSnackbar(`Importação concluída com ${errorCount} erros. Verifique o console para detalhes.`, "error");
        } else {
            showSnackbar("Nenhum membro foi processado. Verifique o formato do arquivo CSV.", "info");
        }

        if (onUploadComplete) {
            onUploadComplete();
        }
    };

    reader.onerror = () => {
        showSnackbar("Erro ao ler o arquivo.", "error");
    };

    reader.readAsText(file);
};