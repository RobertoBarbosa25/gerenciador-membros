package gerenciador.service;

import gerenciador.model.Membro;
import gerenciador.repository.MembroRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional; // Importe Optional
import java.util.ArrayList; // Importe ArrayList
import java.util.Map; // Importe Map

@Service
public class MembroService {

    private final MembroRepository membroRepository;

    public MembroService(MembroRepository membroRepository) {
        this.membroRepository = membroRepository;
    }

    public List<Membro> getAllMembros() {
        return membroRepository.findAll();
    }

    // NOVO: Método paginado
    public Page<Membro> getMembrosPaginated(Pageable pageable) {
        return membroRepository.findAll(pageable);
    }

    // --- MÉTODO getMembroById QUE FALTAVA OU ESTAVA INCORRETO ---
    public Optional<Membro> getMembroById(Long id) {
        return membroRepository.findById(id);
    }
    // -----------------------------------------------------------

    public Membro saveMembro(Membro membro) {
        // Adicione lógica de validação ou regras de negócio aqui antes de salvar
        return membroRepository.save(membro);
    }

    @Transactional
    public Membro updateMembro(Long id, Membro membroDetails) {
        return membroRepository.findById(id).map(membro -> {
            membro.setName(membroDetails.getName());
            membro.setResonance(membroDetails.getResonance());
            membro.setMemberClass(membroDetails.getMemberClass());
            membro.setPhone(membroDetails.getPhone());
            membro.setDiscordId(membroDetails.getDiscordId());
            membro.setCla(membroDetails.getCla());
            return membroRepository.save(membro);
        }).orElseThrow(() -> new RuntimeException("Membro não encontrado com ID: " + id));
    }

    @Transactional
    public void deleteMembro(Long id) {
        if (!membroRepository.existsById(id)) {
            throw new RuntimeException("Membro não encontrado com ID: " + id);
        }
        
        membroRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllMembros() {
        // Primeiro, limpar todas as relações many-to-many
        List<Membro> membros = membroRepository.findAll();
        for (Membro membro : membros) {
            membro.getPartidas().clear();
        }
        membroRepository.saveAll(membros);
        
        // Agora deletar todos os membros
        membroRepository.deleteAll();
    }

    // Método de busca com filtros (já existente)
    public List<Membro> searchMembros(String name, String memberClass, String cla) {
        if (name != null && !name.trim().isEmpty()) {
            return membroRepository.findByNameContainingIgnoreCase(name);
        } else if (memberClass != null && !memberClass.trim().isEmpty()) {
            return membroRepository.findByMemberClassIgnoreCase(memberClass);
        } else if (cla != null && !cla.trim().isEmpty()) {
            return membroRepository.findByClaIgnoreCase(cla);
        } else {
            return membroRepository.findAll();
        }
    }

    // NOVO: Busca paginada com filtros
    public Page<Membro> searchMembrosPaginated(String name, String memberClass, String cla, Pageable pageable) {
        if (name != null && !name.trim().isEmpty()) {
            return membroRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (memberClass != null && !memberClass.trim().isEmpty()) {
            return membroRepository.findByMemberClassIgnoreCase(memberClass, pageable);
        } else if (cla != null && !cla.trim().isEmpty()) {
            return membroRepository.findByClaIgnoreCase(cla, pageable);
        } else {
            return membroRepository.findAll(pageable);
        }
    }

    // --- MÉTODOS DE ESTATÍSTICAS PARA DASHBOARD ---
    
    public long getTotalMembros() {
        return membroRepository.count();
    }
    
    public Map<String, Long> getMembrosPorClasse() {
        List<Membro> membros = membroRepository.findAll();
        return membros.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                Membro::getMemberClass,
                java.util.stream.Collectors.counting()
            ));
    }
    
    public Map<String, Long> getMembrosPorCla() {
        List<Membro> membros = membroRepository.findAll();
        return membros.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                Membro::getCla,
                java.util.stream.Collectors.counting()
            ));
    }
    
    public double getResonanciaMedia() {
        List<Membro> membros = membroRepository.findAll();
        if (membros.isEmpty()) return 0.0;
        
        double soma = membros.stream()
            .mapToLong(m -> m.getResonance() != null ? m.getResonance() : 0)
            .sum();
        return soma / membros.size();
    }
    
    public long getResonanciaMaxima() {
        List<Membro> membros = membroRepository.findAll();
        if (membros.isEmpty()) return 0;
        
        return membros.stream()
            .mapToLong(m -> m.getResonance() != null ? m.getResonance() : 0)
            .max()
            .orElse(0);
    }

    // NOVO: Método para exportar membros em CSV
    public String exportMembrosToCSV() {
        List<Membro> membros = membroRepository.findAll();
        
        StringBuilder csv = new StringBuilder();
        // Cabeçalho
        csv.append("ID,Nome,Classe,Ressonância,Telefone,Discord ID,Clã\n");
        
        // Dados
        for (Membro membro : membros) {
            csv.append(String.format("%d,%s,%s,%d,%s,%s,%s\n",
                membro.getId(),
                escapeCsvField(membro.getName()),
                escapeCsvField(membro.getMemberClass()),
                membro.getResonance() != null ? membro.getResonance() : 0,
                escapeCsvField(membro.getPhone() != null ? membro.getPhone() : ""),
                escapeCsvField(membro.getDiscordId() != null ? membro.getDiscordId() : ""),
                escapeCsvField(membro.getCla())
            ));
        }
        
        return csv.toString();
    }
    
    private String escapeCsvField(String field) {
        if (field == null) return "";
        // Se contém vírgula, aspas ou quebra de linha, envolve em aspas
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }

    // --- NOVO MÉTODO: Importação em Lote ---
    @Transactional
    public BatchImportResult importMembrosBatch(List<Membro> membros) {
        BatchImportResult result = new BatchImportResult();
        
        for (Membro membro : membros) {
            try {
                // Validação básica
                if (membro.getName() == null || membro.getName().trim().isEmpty()) {
                    result.addError("Nome é obrigatório para o membro");
                    continue;
                }
                
                if (membro.getResonance() == null) {
                    result.addError("Ressonância é obrigatória para " + membro.getName());
                    continue;
                }
                
                if (membro.getMemberClass() == null || membro.getMemberClass().trim().isEmpty()) {
                    result.addError("Classe é obrigatória para " + membro.getName());
                    continue;
                }
                
                if (membro.getCla() == null || membro.getCla().trim().isEmpty()) {
                    result.addError("Clã é obrigatório para " + membro.getName());
                    continue;
                }
                
                // Garantir que campos opcionais não sejam null
                if (membro.getPhone() == null) {
                    membro.setPhone("");
                }
                if (membro.getDiscordId() == null) {
                    membro.setDiscordId("");
                }
                
                // Verificar se já existe um membro com o mesmo nome
                List<Membro> existingMembros = membroRepository.findByNameContainingIgnoreCase(membro.getName().trim());
                boolean alreadyExists = existingMembros.stream()
                    .anyMatch(existing -> existing.getName().equalsIgnoreCase(membro.getName().trim()));
                
                if (alreadyExists) {
                    result.addSkipped(membro.getName());
                } else {
                    membroRepository.save(membro);
                    result.addSuccess(membro.getName());
                }
                
            } catch (Exception e) {
                result.addError("Erro ao processar " + (membro.getName() != null ? membro.getName() : "membro sem nome") + ": " + e.getMessage());
            }
        }
        
        return result;
    }

    // --- CLASSE INTERNA PARA RESULTADO DO BATCH ---
    public static class BatchImportResult {
        private int successCount = 0;
        private int skippedCount = 0;
        private int errorCount = 0;
        private List<String> successNames = new ArrayList<>();
        private List<String> skippedNames = new ArrayList<>();
        private List<String> errorMessages = new ArrayList<>();
        
        public void addSuccess(String name) {
            successCount++;
            successNames.add(name);
        }
        
        public void addSkipped(String name) {
            skippedCount++;
            skippedNames.add(name);
        }
        
        public void addError(String error) {
            errorCount++;
            errorMessages.add(error);
        }
        
        // Getters
        public int getSuccessCount() { return successCount; }
        public int getSkippedCount() { return skippedCount; }
        public int getErrorCount() { return errorCount; }
        public List<String> getSuccessNames() { return successNames; }
        public List<String> getSkippedNames() { return skippedNames; }
        public List<String> getErrorMessages() { return errorMessages; }
    }
}