package gerenciador.service;

import gerenciador.model.Ciclo;
import gerenciador.model.GestaoPresenca;
import gerenciador.model.GestaoVigilia;
import gerenciador.model.Membro;
import gerenciador.repository.GestaoPresencaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GestaoPresencaService {
    private final GestaoPresencaRepository repository;

    @Autowired
    public GestaoPresencaService(GestaoPresencaRepository repository) {
        this.repository = repository;
    }

    public GestaoPresenca salvarOuAtualizarPresenca(Membro membro, GestaoVigilia gestaoVigilia, String status, boolean escalado, Ciclo ciclo) {
        // Buscar presença específica por membro, vigília E ciclo (não apenas membro + vigília)
        Optional<GestaoPresenca> existente = repository.findByMembroAndGestaoVigiliaAndCiclo(membro, gestaoVigilia, ciclo);
        GestaoPresenca presenca = existente.orElse(new GestaoPresenca(gestaoVigilia, membro, status, escalado, ciclo));
        presenca.setStatus(status);
        presenca.setEscalado(escalado);
        presenca.setCiclo(ciclo);
        return repository.save(presenca);
    }

    public List<GestaoPresenca> buscarPorVigilia(GestaoVigilia gestaoVigilia) {
        return repository.findByGestaoVigilia(gestaoVigilia);
    }

    public List<GestaoPresenca> buscarPorMembro(Membro membro) {
        return repository.findByMembro(membro);
    }

    public Optional<GestaoPresenca> buscarPorMembroEVigilia(Membro membro, GestaoVigilia gestaoVigilia) {
        return repository.findByMembroAndGestaoVigilia(membro, gestaoVigilia);
    }

    // Novos métodos para trabalhar com ciclos
    public List<GestaoPresenca> buscarPorCiclo(Ciclo ciclo) {
        return repository.findByCiclo(ciclo);
    }

    public List<GestaoPresenca> buscarPorCicloEVigilia(Ciclo ciclo, GestaoVigilia gestaoVigilia) {
        return repository.findByCicloAndGestaoVigilia(ciclo, gestaoVigilia);
    }

    public List<GestaoPresenca> buscarPorCicloEMembro(Ciclo ciclo, Membro membro) {
        return repository.findByCicloAndMembro(ciclo, membro);
    }

    // Método para buscar todas as presenças de um ciclo por ID
    public List<GestaoPresenca> buscarPresencasPorCiclo(Long cicloId) {
        return repository.findByCicloIdWithFetch(cicloId);
    }

    @Transactional
    public void limparPresencasDoCiclo(Ciclo ciclo) {
        List<GestaoPresenca> presencas = repository.findByCiclo(ciclo);
        System.out.println("🗑️ Encontradas " + presencas.size() + " presenças para deletar do ciclo: " + ciclo.getNome());
        repository.deleteAll(presencas);
        System.out.println("✅ Presenças deletadas com sucesso");
    }
} 