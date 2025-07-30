package gerenciador.service;

import gerenciador.dto.CicloDTO;
import gerenciador.dto.CicloVigiliaDTO;
import gerenciador.model.Ciclo;
import gerenciador.model.CicloVigilia;
import gerenciador.model.GestaoVigilia;
import gerenciador.repository.CicloRepository;
import gerenciador.repository.CicloVigiliaRepository;
import gerenciador.repository.GestaoVigiliaRepository;
import gerenciador.service.GestaoPresencaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CicloService {
    private final CicloRepository cicloRepository;
    private final CicloVigiliaRepository cicloVigiliaRepository;
    private final GestaoVigiliaRepository gestaoVigiliaRepository;
    private final GestaoPresencaService gestaoPresencaService;

        @Autowired
    public CicloService(CicloRepository cicloRepository,
                       CicloVigiliaRepository cicloVigiliaRepository,
                       GestaoVigiliaRepository gestaoVigiliaRepository,
                       GestaoPresencaService gestaoPresencaService) {
        this.cicloRepository = cicloRepository;
        this.cicloVigiliaRepository = cicloVigiliaRepository;
        this.gestaoVigiliaRepository = gestaoVigiliaRepository;
        this.gestaoPresencaService = gestaoPresencaService;
    }

    public List<CicloDTO> listarTodos() {
        return cicloRepository.findAllByOrderByDataInicioDesc()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<CicloDTO> listarAtivos() {
        return cicloRepository.findByAtivoOrderByDataInicioDesc(true)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Optional<CicloDTO> buscarPorId(Long id) {
        return cicloRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional
    public CicloDTO criarCiclo(String nome, List<Long> vigiliaIds) {
        try {
            System.out.println("Criando ciclo: " + nome + " com vigílias: " + vigiliaIds);
            
            // Desativar todos os ciclos ativos de uma vez
            LocalDateTime agora = LocalDateTime.now();
            cicloRepository.desativarTodosCiclosAtivos(agora);

            // Criar novo ciclo
            Ciclo novoCiclo = new Ciclo(nome);
            novoCiclo.setAtivo(true); // Garantir que seja ativo
            novoCiclo = cicloRepository.save(novoCiclo);

            // Adicionar vigílias ao ciclo
            for (int i = 0; i < vigiliaIds.size() && i < 3; i++) {
                Long vigiliaId = vigiliaIds.get(i);
                
                Optional<GestaoVigilia> vigiliaOpt = gestaoVigiliaRepository.findById(vigiliaId);
                if (vigiliaOpt.isPresent()) {
                    CicloVigilia cicloVigilia = new CicloVigilia(novoCiclo, vigiliaOpt.get(), i + 1);
                    cicloVigiliaRepository.save(cicloVigilia);
                }
            }

            // Verificação final: garantir que apenas este ciclo esteja ativo
            List<CicloDTO> ciclosAtivosAposCriacao = listarAtivos();

            // NOTA: Removida a lógica que limpava presenças do ciclo anterior
            // As presenças devem ser preservadas para o histórico

            return convertToDTO(novoCiclo);
        } catch (Exception e) {
            System.err.println("Erro ao criar ciclo: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void deletarCiclo(Long id) {
        try {
            System.out.println("🔄 Iniciando deleção do ciclo ID: " + id);
            
            // Verificar se o ciclo existe
            Optional<Ciclo> cicloOpt = cicloRepository.findById(id);
            if (cicloOpt.isEmpty()) {
                throw new IllegalArgumentException("Ciclo com ID " + id + " não encontrado");
            }
            
            Ciclo ciclo = cicloOpt.get();
            System.out.println("📋 Ciclo encontrado: " + ciclo.getNome() + " (Ativo: " + ciclo.isAtivo() + ")");
            
            // Verificar se é o ciclo ativo
            if (ciclo.isAtivo()) {
                throw new IllegalStateException("Não é possível deletar um ciclo ativo. Desative-o primeiro.");
            }
            
            // Deletar presenças do ciclo primeiro
            System.out.println("🗑️ Deletando presenças do ciclo...");
            gestaoPresencaService.limparPresencasDoCiclo(ciclo);
            System.out.println("✅ Presenças deletadas");
            
            // Deletar relacionamentos
            System.out.println("🔗 Deletando relacionamentos ciclo-vigília...");
            List<CicloVigilia> cicloVigilias = cicloVigiliaRepository.findByCicloIdOrderByOrdem(id);
            System.out.println("📊 Encontrados " + cicloVigilias.size() + " relacionamentos para deletar");
            cicloVigiliaRepository.deleteAll(cicloVigilias);
            System.out.println("✅ Relacionamentos deletados");
            
            // Deletar ciclo
            System.out.println("🗑️ Deletando ciclo...");
            cicloRepository.deleteById(id);
            System.out.println("✅ Ciclo deletado");
            
            System.out.println("🎉 Ciclo " + ciclo.getNome() + " (ID: " + id + ") deletado com sucesso");
        } catch (Exception e) {
            System.err.println("❌ Erro ao deletar ciclo " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<CicloVigilia> buscarVigiliasDoCiclo(Long cicloId) {
        return cicloVigiliaRepository.findByCicloIdOrderByOrdem(cicloId);
    }

    public Optional<CicloDTO> buscarCicloAtivo() {
        List<CicloDTO> ativos = listarAtivos();
        return ativos.isEmpty() ? Optional.empty() : Optional.of(ativos.get(0));
    }

    // Método para converter Ciclo para CicloDTO
    private CicloDTO convertToDTO(Ciclo ciclo) {
        CicloDTO dto = new CicloDTO(
            ciclo.getId(),
            ciclo.getNome(),
            ciclo.getDataInicio(),
            ciclo.getDataFim(),
            ciclo.isAtivo()
        );
        
        // Converter cicloVigilias se necessário
        if (ciclo.getCicloVigilias() != null) {
            List<CicloVigiliaDTO> vigiliasDTO = ciclo.getCicloVigilias().stream()
                .map(this::convertToVigiliaDTO)
                .collect(Collectors.toList());
            dto.setCicloVigilias(vigiliasDTO);
        }
        
        return dto;
    }

    // Método para converter CicloVigilia para CicloVigiliaDTO
    private CicloVigiliaDTO convertToVigiliaDTO(CicloVigilia cicloVigilia) {
        return new CicloVigiliaDTO(
            cicloVigilia.getId(),
            cicloVigilia.getGestaoVigilia().getId(),
            cicloVigilia.getGestaoVigilia().getNome(),
            cicloVigilia.getOrdem()
        );
    }
} 