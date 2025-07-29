// src/Pages/Register/Register.utils.ts
import membrosApi from '../../Services/membrosApi';
const validateCSVFormat = (lines) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        preview: [],
        totalLines: lines.length,
        validLines: 0
    };
    if (lines.length === 0) {
        result.errors.push("Arquivo CSV está vazio");
        result.isValid = false;
        return result;
    }
    // Verificar cabeçalho (primeira linha)
    const header = lines[0];
    const expectedColumns = ['Timestamp', 'Nome', 'Classe', 'Ressonância', 'Telefone', 'Discord ID', 'Clã'];
    const actualColumns = header.split(',').map(col => col.trim());
    if (actualColumns.length < 7) {
        result.errors.push(`Formato inválido: esperado pelo menos 7 colunas, encontrado ${actualColumns.length}`);
        result.isValid = false;
    }
    // Validar dados (pular primeira linha)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;
        if (!line.trim()) {
            result.warnings.push(`Linha ${lineNumber}: linha vazia, ignorada`);
            continue;
        }
        const columns = line.split(',');
        if (columns.length < 7) {
            result.errors.push(`Linha ${lineNumber}: formato inválido (${columns.length} colunas)`);
            continue;
        }
        // Extrair dados
        const name = columns[1]?.trim();
        const memberClass = columns[2]?.trim();
        const resonanceStr = columns[3]?.trim();
        const phone = columns[4]?.trim() || '';
        const discordId = columns[5]?.trim() || '';
        const cla = columns[6]?.trim();
        // Validações
        if (!name || name.length < 2) {
            result.errors.push(`Linha ${lineNumber}: nome inválido ou muito curto`);
            continue;
        }
        if (!memberClass) {
            result.errors.push(`Linha ${lineNumber}: classe não especificada`);
            continue;
        }
        const resonance = parseFloat(resonanceStr || '0');
        if (isNaN(resonance) || resonance <= 0) {
            result.errors.push(`Linha ${lineNumber}: ressonância inválida (${resonanceStr})`);
            continue;
        }
        if (resonance > 100000) {
            result.warnings.push(`Linha ${lineNumber}: ressonância muito alta (${resonance}), verificar se está correto`);
        }
        if (!cla) {
            result.errors.push(`Linha ${lineNumber}: clã não especificado`);
            continue;
        }
        // Adicionar à preview (máximo 5 linhas)
        if (result.preview.length < 5) {
            result.preview.push({
                name,
                resonance,
                memberClass: memberClass,
                phone,
                discordId,
                cla: cla
            });
        }
        result.validLines++;
    }
    // Verificar se há dados válidos
    if (result.validLines === 0) {
        result.errors.push("Nenhuma linha válida encontrada no arquivo");
        result.isValid = false;
    }
    return result;
};
export const handleCSVUpload = async (event, showSnackbar, onUploadComplete, onProgress) => {
    const file = event.target.files?.[0];
    if (!file) {
        showSnackbar("Nenhum arquivo selecionado.", "warning");
        return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target?.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        // --- VALIDAÇÃO DO CSV ---
        showSnackbar("Validando arquivo CSV...", "info");
        const validation = validateCSVFormat(lines);
        if (!validation.isValid) {
            showSnackbar(`Arquivo inválido: ${validation.errors[0]}`, "error");
            console.error("Erros de validação:", validation.errors);
            return;
        }
        if (validation.warnings.length > 0) {
            console.warn("Avisos de validação:", validation.warnings);
        }
        // Mostrar preview
        console.log("Preview dos dados:", validation.preview);
        showSnackbar(`Arquivo válido! ${validation.validLines} membros serão importados.`, "success");
        // --- PROCESSAMENTO DOS DADOS VÁLIDOS ---
        const membrosParaImportar = [];
        let linhasInvalidas = 0;
        // Pular primeira linha (cabeçalho) e processar apenas linhas válidas
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim())
                continue;
            const columns = line.split(',');
            // Mapeamento de colunas
            const name = columns[1]?.trim();
            const memberClass = columns[2]?.trim();
            const resonance = parseFloat(columns[3]?.trim() || '0');
            const phone = columns[4]?.trim() || '';
            const discordId = columns[5]?.trim() || '';
            const cla = columns[6]?.trim();
            // Validação final
            if (!name || isNaN(resonance) || !memberClass || !cla) {
                linhasInvalidas++;
                continue;
            }
            membrosParaImportar.push({
                name,
                resonance,
                memberClass,
                phone,
                discordId,
                cla,
            });
            // Atualizar progresso
            if (onProgress) {
                const progress = ((i + 1) / lines.length) * 50; // 50% para processamento
                onProgress(progress);
            }
        }
        if (membrosParaImportar.length === 0) {
            showSnackbar("Nenhum membro válido encontrado no arquivo CSV.", "warning");
            return;
        }
        try {
            // --- CHAMADA ÚNICA PARA O BACKEND ---
            showSnackbar(`Enviando ${membrosParaImportar.length} membros para o servidor...`, "info");
            if (onProgress)
                onProgress(75); // 75% para envio
            const result = await membrosApi.importMembrosBatch(membrosParaImportar);
            if (onProgress)
                onProgress(100); // 100% concluído
            // Construir mensagem de resultado
            let message = `Importação concluída! `;
            if (result.successCount > 0) {
                message += `${result.successCount} novos membros cadastrados. `;
            }
            if (result.skippedCount > 0) {
                message += `${result.skippedCount} membros já existentes (ignorados). `;
            }
            if (result.errorCount > 0) {
                message += `${result.errorCount} erros. `;
            }
            if (linhasInvalidas > 0) {
                message += `${linhasInvalidas} linhas com dados inválidos. `;
            }
            const severity = result.errorCount > 0 ? "warning" : "success";
            showSnackbar(message, severity);
            // Log detalhado no console para debug
            if (result.successNames.length > 0) {
                console.log("Membros importados com sucesso:", result.successNames);
            }
            if (result.skippedNames.length > 0) {
                console.log("Membros ignorados (já existem):", result.skippedNames);
            }
            if (result.errorMessages.length > 0) {
                console.error("Erros durante importação:", result.errorMessages);
            }
        }
        catch (error) {
            console.error("Erro na importação em lote:", error);
            showSnackbar("Erro ao importar membros. Verifique o console para detalhes.", "error");
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
