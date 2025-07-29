import React, { useEffect, useMemo } from 'react';
import { Box, Paper, Snackbar, Alert, Pagination, Button } from '@mui/material';
import { PageWrapper } from '../../Components/PageWrapper';
import { MembersTable } from './MembersTable';
import { useMembersFilters } from './hooks/useMembersFilters';
import { MemberListHeader } from './components/MemberListHeader';
import { MemberStats } from './components/MemberStats';
import { MemberEditDialog } from './components/MemberEditDialog';
import { MemberConfirmDialog } from './components/MemberConfirmDialog';
import { useMemberEdit } from './hooks/useMemberEdit';
import { useMemberRemove } from './hooks/useMemberRemove';
import { useSnackbar } from './hooks/useSnackbar';
import { getAverageResonance, getClaData } from './utils';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useState } from 'react';
import membrosApi from '../../Services/membrosApi';

export const Members = () => {
  console.log('🔄 Componente Members renderizado');
  
  const {
    filter, setFilter,
    filterClass, setFilterClass,
    filterCla, setFilterCla,
    players,
    error,
    fetchPlayers,
    isLoading
  } = useMembersFilters();

  // Ordenação local (pode ser extraída para hook/util)
  const [orderBy, setOrderBy] = React.useState<'name' | 'memberClass' | 'resonance'>('name');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const sortedPlayers = useMemo(() => {
    if (!players) return [];
    const sorted = [...players];
    if (orderBy === 'name') {
      sorted.sort((a, b) =>
        order === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (orderBy === 'memberClass') {
      sorted.sort((a, b) =>
        order === 'asc'
          ? a.memberClass.localeCompare(b.memberClass)
          : b.memberClass.localeCompare(a.memberClass)
      );
    } else if (orderBy === 'resonance') {
      sorted.sort((a, b) =>
        order === 'asc'
          ? (a.resonance || 0) - (b.resonance || 0)
          : (b.resonance || 0) - (a.resonance || 0)
      );
    }
    return sorted;
  }, [players, orderBy, order]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedPlayers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedPlayers.slice(start, start + rowsPerPage);
  }, [sortedPlayers, page]);
  const totalPages = Math.ceil(sortedPlayers.length / rowsPerPage);

  // Hooks customizados
  const {
    editingPlayerId, tempPlayer, loading: editLoading,
    handleEdit, handleSaveEdit, handleCancelEdit, handleChange
  } = useMemberEdit(sortedPlayers, fetchPlayers);

  const {
    removingId, loading: removeLoading, confirmOpen, confirmTitle, confirmMessage, confirmButtonText,
    openConfirmation, handleCloseConfirm, handleConfirmAction
  } = useMemberRemove(fetchPlayers);

  const {
    snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleCloseSnackbar
  } = useSnackbar();

  // Estatísticas
  const averageResonance = useMemo(() => getAverageResonance(sortedPlayers), [sortedPlayers]);
  const claData = useMemo(() => getClaData(sortedPlayers), [sortedPlayers]);

  // Handlers de ordenação
  const handleSortRequest = (property: 'name' | 'memberClass' | 'resonance') => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

      // Limpar base de dados (pode ser extraído para hook)
    const handleClearDatabase = async () => {
        if (window.confirm("Tem certeza que deseja limpar TODA a base de dados de membros? Esta ação é irreversível!")) {
            try {
                await membrosApi.deleteAllMembros();
                showSnackbar("Todos os membros foram removidos com sucesso!", "success");
                // Recarregar dados do backend
                fetchPlayers();
            } catch (error) {
                console.error("Erro ao limpar base de dados:", error);
                showSnackbar("Erro ao limpar base de dados. Tente novamente.", "error");
            }
        }
    };

    return (
        <PageWrapper>
            <Box
                component={Paper}
                sx={{
          backgroundColor: '#23272f',
          color: '#fff',
          maxWidth: 1200,
          width: '100%',
                    margin: 'auto',
          p: 0,
                    borderRadius: 2,
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
                }}
            >
        <Box sx={{ p: { xs: 1, md: 3 } }}>
          {/* Header com filtros e média de ressonância */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 2, background: '#232b36', borderRadius: 3, px: 3, py: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <MemberListHeader
                filter={filter}
                setFilter={setFilter}
                filterClass={filterClass}
                setFilterClass={setFilterClass}
                filterCla={filterCla}
                setFilterCla={setFilterCla}
                total={sortedPlayers.length}
                page={0}
                isLoading={isLoading} // NOVO: Passar estado de loading
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 120 }}>
              <Box sx={{
                background: 'linear-gradient(180deg, #1e88e5 60%, #42a5f5 100%)',
                color: '#fff',
                borderRadius: 2,
                px: 3,
                py: 1,
                minWidth: 90,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                mb: 1
              }}>
                <div style={{ fontSize: 10, fontWeight: 400, color: '#e3f2fd', marginBottom: 2, letterSpacing: 0.5 }}>Média de Ressonância</div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 36, lineHeight: 1 }}>{averageResonance}</div>
              </Box>
            </Box>
          </Box>
          {/* Tabela */}
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Box sx={{ minWidth: 1000 }}>
                        <MembersTable
                players={paginatedPlayers}
                            editingPlayerId={editingPlayerId}
                            tempPlayer={tempPlayer}
                highlightedRow={null}
                highlightType={null}
                            onEdit={handleEdit}
                onRemove={openConfirmation}
                            onChange={handleChange}
                            onSave={handleSaveEdit}
                            onCancel={handleCancelEdit}
                disableActions={editLoading || removeLoading}
                            isLoading={isLoading}
                            orderBy={orderBy}
                            order={order}
                            handleSortRequest={handleSortRequest}
                        />
                    </Box>
          </Box>
          {/* Paginação */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, width: '100%' }}>
                    <Pagination
                        count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
          {/* Botão */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, width: '100%' }}>
                        <Button
                            onClick={handleClearDatabase}
                            color="error"
                            variant="contained"
                            aria-label="Limpar todos os membros"
              sx={{ minWidth: 220 }}
                        >
                            Limpar Base de Dados (Todos)
                        </Button>
                    </Box>
                </Box>
            </Box>
      <MemberEditDialog
        open={!!editingPlayerId}
        tempPlayer={tempPlayer}
        onChange={handleChange}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
      <MemberConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmButtonText={confirmButtonText}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmAction}
      />
            <Snackbar
        open={snackbarOpen || !!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    variant="filled"
                    aria-live="polite"
                >
          {snackbarMessage || error}
                </Alert>
            </Snackbar>
        </PageWrapper>
    );
};