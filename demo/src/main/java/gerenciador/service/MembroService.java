package gerenciador.service;

import gerenciador.model.Membro;
import gerenciador.repository.MembroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional; // Importe Optional

@Service
public class MembroService {

    private final MembroRepository membroRepository;

    public MembroService(MembroRepository membroRepository) {
        this.membroRepository = membroRepository;
    }

    public List<Membro> getAllMembros() {
        return membroRepository.findAll();
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

    public List<Membro> searchMembros(String name, String memberClass, String cla) {
        if (name != null && !name.isEmpty() && memberClass != null && !memberClass.isEmpty() && cla != null && !cla.isEmpty()) {
            return membroRepository.searchByNameUnaccent(name).stream()
                .filter(m -> m.getMemberClass().equalsIgnoreCase(memberClass) && m.getCla().equalsIgnoreCase(cla))
                .toList();
        } else if (name != null && !name.isEmpty() && memberClass != null && !memberClass.isEmpty()) {
            return membroRepository.searchByNameUnaccent(name).stream()
                .filter(m -> m.getMemberClass().equalsIgnoreCase(memberClass))
                .toList();
        } else if (name != null && !name.isEmpty() && cla != null && !cla.isEmpty()) {
            return membroRepository.searchByNameUnaccent(name).stream()
                .filter(m -> m.getCla().equalsIgnoreCase(cla))
                .toList();
        } else if (memberClass != null && !memberClass.isEmpty() && cla != null && !cla.isEmpty()) {
            return membroRepository.findByMemberClassIgnoreCaseAndClaIgnoreCase(memberClass, cla);
        } else if (memberClass != null && !memberClass.isEmpty()) {
            return membroRepository.findByMemberClassIgnoreCase(memberClass);
        } else if (cla != null && !cla.isEmpty()) {
            return membroRepository.findByClaIgnoreCase(cla);
        } else if (name != null && !name.isEmpty()) {
            return membroRepository.searchByNameUnaccent(name);
        } else {
            return membroRepository.findAll();
        }
    }

    @Transactional
    public void deleteAllMembros() {
        // Primeiro, limpa a tabela de relacionamento partida_membros
        membroRepository.clearPartidaMembros();
        
        // Agora pode deletar todos os membros
        membroRepository.deleteAll();
    }
}