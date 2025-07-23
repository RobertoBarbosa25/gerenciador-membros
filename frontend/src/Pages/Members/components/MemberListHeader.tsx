import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { MembersFilters } from '../MembersFilters';

interface MemberListHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  filterClass: string;
  setFilterClass: (value: string) => void;
  filterCla: string;
  setFilterCla: (value: string) => void;
  total: number;
  page: number;
  onClearDatabase?: () => void; // agora opcional
}

export const MemberListHeader: React.FC<MemberListHeaderProps> = ({
  filter, setFilter, filterClass, setFilterClass, filterCla, setFilterCla, total, page, onClearDatabase
}) => (
  <Box mb={2}>
    <MembersFilters
      filter={filter}
      setFilter={setFilter}
      filterClass={filterClass}
      setFilterClass={setFilterClass}
      filterCla={filterCla}
      setFilterCla={setFilterCla}
    />
    <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
      Exibindo {total} membros (página {page + 1})
    </Typography>
    {onClearDatabase && (
      <Button
        onClick={onClearDatabase}
        color="error"
        variant="contained"
        aria-label="Limpar todos os membros"
        sx={{ mt: 1 }}
      >
        Limpar Base de Dados (Todos)
      </Button>
    )}
  </Box>
); 