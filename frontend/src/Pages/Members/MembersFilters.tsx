import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { CLASS_OPTIONS, CLA_OPTIONS } from '../../Types/Rank.constants';

interface MembersFiltersProps {
  filter: string;
  setFilter: (value: string) => void;
  filterClass: string;
  setFilterClass: (value: string) => void;
  filterCla: string;
  setFilterCla: (value: string) => void;
  isLoading?: boolean; // NOVO: Prop para mostrar loading
}

export const MembersFilters: React.FC<MembersFiltersProps> = ({
  filter,
  setFilter,
  filterClass,
  setFilterClass,
  filterCla,
  setFilterCla,
  isLoading = false, // NOVO: Default false
}) => {
  // Estado local para o campo de busca
  const [localFilter, setLocalFilter] = useState(filter);
  
  // Debounce do valor local
  const [debouncedLocalFilter] = useDebounce(localFilter, 500);
  
  // Atualizar o filtro principal quando o debounced mudar
  React.useEffect(() => {
    console.log('⏰ Debounce: atualizando filtro de', filter, 'para', debouncedLocalFilter);
    if (debouncedLocalFilter !== filter) {
      console.log('🔄 setFilter sendo chamado com:', debouncedLocalFilter);
      setFilter(debouncedLocalFilter);
    } else {
      console.log('⏭️ Filtro não mudou, pulando setFilter');
    }
  }, [debouncedLocalFilter, setFilter, filter]);

  return (
    <Box display="flex" flexWrap="wrap" gap={2} mb={2} alignItems="center">
      <Box sx={{ position: 'relative' }}>
        <TextField
          label="Buscar por nome"
          variant="outlined"
          value={localFilter}
          onChange={e => setLocalFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: 180,
            background: '#23272f',
            borderRadius: 2,
            input: { color: '#fff', fontWeight: 500 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1565c0' },
            '& .MuiInputBase-input::placeholder': { color: '#bbb', opacity: 1 },
          }}
          InputLabelProps={{ sx: { color: '#1976d2' } }}
        />
        {/* NOVO: Indicador de loading */}
        {isLoading && (
          <CircularProgress
            size={16}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#1976d2'
            }}
          />
        )}
      </Box>
      <Autocomplete
        options={["", ...CLASS_OPTIONS]}
        value={filterClass}
        onChange={(_, newValue) => setFilterClass(newValue || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Classe"
            variant="outlined"
            size="small"
            sx={{
              minWidth: 140,
              background: '#23272f',
              borderRadius: 2,
              input: { color: '#fff', fontWeight: 500 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1565c0' },
              '& .MuiInputBase-input::placeholder': { color: '#bbb', opacity: 1 },
            }}
            InputLabelProps={{ sx: { color: '#1976d2' } }}
          />
        )}
        sx={{ minWidth: 140 }}
        disableClearable={false}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={option => option === '' ? 'Todas' : option}
        ListboxProps={{
          sx: {
            background: '#23272f',
            color: '#fff',
          },
        }}
      />
      <Autocomplete
        options={["", ...CLA_OPTIONS]}
        value={filterCla}
        onChange={(_, newValue) => setFilterCla(newValue || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Clã"
            variant="outlined"
            size="small"
            sx={{
              minWidth: 140,
              background: '#23272f',
              borderRadius: 2,
              input: { color: '#fff', fontWeight: 500 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1565c0' },
              '& .MuiInputBase-input::placeholder': { color: '#bbb', opacity: 1 },
            }}
            InputLabelProps={{ sx: { color: '#1976d2' } }}
          />
        )}
        sx={{ minWidth: 140 }}
        disableClearable={false}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={option => option === '' ? 'Todos' : option}
        ListboxProps={{
          sx: {
            background: '#23272f',
            color: '#fff',
          },
        }}
      />
      <Button
        variant="outlined"
        color="info"
        sx={{ minWidth: 120, height: 40 }}
        onClick={() => {
          setLocalFilter('');
          setFilter('');
          setFilterClass('');
          setFilterCla('');
        }}
      >
        Limpar Filtros
      </Button>
    </Box>
  );
};