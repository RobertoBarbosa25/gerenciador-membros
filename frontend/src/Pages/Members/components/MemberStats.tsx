import React from 'react';
import { Box, Typography } from '@mui/material';

interface MemberStatsProps {
  averageResonance: number;
  claData: { name: string; value: number }[];
}

export const MemberStats: React.FC<MemberStatsProps> = ({ averageResonance, claData }) => (
  <Box mb={2}>
    <Typography variant="subtitle1" sx={{ color: '#61dafb', fontWeight: 'bold' }}>
      Média de Ressonância: {averageResonance}
    </Typography>
    {/* Aqui pode-se adicionar um gráfico de clãs futuramente */}
    <Typography variant="body2" sx={{ color: '#aaa' }}>
      Clãs: {claData.map(c => `${c.name}: ${c.value}`).join(', ')}
    </Typography>
  </Box>
); 