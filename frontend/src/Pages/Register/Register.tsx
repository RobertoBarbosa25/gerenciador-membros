// src/Pages/Register/Register.tsx

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { Player } from '../../Types/Rank';
import { SelectChangeEvent } from '@mui/material/Select';
import { TextMaskCustom } from '../../Components/TextMaskCustom';
import { PageWrapper } from '../../Components/PageWrapper';
import logo from "../../Assets/chernobyl-logo.jpg"
import { handleCSVUpload as handleCSVImport } from './Register.utils';

// Importar o serviço da API
import membrosApi from '../../Services/membrosApi';

export const Register = () => {
  const [player, setPlayer] = useState<{
    name: string;
    resonance: number;
    memberClass: Player['memberClass'];
    phone: string;
    discordId: string; // Já é string, pode ser vazia
    cla: Player['cla'];
  }>({
    name: '',
    resonance: 0,
    memberClass: 'Arcanista',
    phone: '',
    discordId: '', // Valor inicial vazio
    cla: 'Chernobyl',
  });

  // *** ESTADOS DO SNACKBAR ***
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // *** FUNÇÕES DO SNACKBAR ***
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlayer(prev => ({
      ...prev,
      [name as string]: name === 'resonance' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPlayer(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação: 'discordId' não é mais obrigatório aqui
    if (!player.name || player.resonance === undefined || !player.memberClass || !player.cla) {
      showSnackbar("Por favor, preencha os campos obrigatórios (Nome, Ressonância, Classe, Clã).", "warning");
      return;
    }

    try {
      const playerToRegister = {
          name: player.name,
          resonance: player.resonance,
          memberClass: player.memberClass,
          phone: player.phone,
          discordId: player.discordId, // Enviará vazio se não preenchido
          cla: player.cla,
      };

      await membrosApi.createMembro(playerToRegister);

      setPlayer({
        name: '',
        resonance: 0,
        memberClass: 'Arcanista',
        phone: '',
        discordId: '',
        cla: 'Chernobyl',
      });

      showSnackbar("Jogador cadastrado com sucesso!", "success");

    } catch (error) {
      console.error("Erro ao cadastrar jogador:", error);
      // Mensagem de erro mais genérica, já que Discord ID pode não ser o problema
      showSnackbar("Erro ao cadastrar jogador. Verifique os dados e tente novamente.", "error");
    }
  };

  const handleCSVUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleCSVImport(event, showSnackbar, () => {
        // Callback opcional após a importação do CSV
    });
  };

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="center" alignItems="center" width="100%">
        <Box component={Paper} maxWidth={500} p={3} sx={{
          backgroundColor: '#2c2c2c',
          borderRadius: '8px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
          border: '1px solid #ffff00',
          color: '#fff',
          fontFamily: '"Courier New", Courier, monospace',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(255, 255, 0, 0.8)',
          },
        }}>
          <Typography variant="h5" gutterBottom sx={{
            color: '#ffff00',
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textShadow: '0px 0px 10px rgba(255, 255, 0, 0.8)',
          }}>
            Cadastro de Membros
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              name="name"
              fullWidth
              margin="normal"
              value={player.name}
              onChange={handleChange}
              required
              sx={{
                input: {
                  color: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#ffff00',
                },
                '& .MuiOutlinedInput-root': {
                  borderColor: '#ffff00',
                  backgroundColor: '#444',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  borderColor: '#ffff00',
                  backgroundColor: '#333',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 1)',
                },
              }}
            />
            <TextField
              label="Ressonância"
              name="resonance"
              type="number"
              fullWidth
              margin="normal"
              value={player.resonance}
              onChange={handleChange}
              required
              sx={{
                input: {
                  color: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#ffff00',
                },
                '& .MuiOutlinedInput-root': {
                  borderColor: '#ffff00',
                  backgroundColor: '#444',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  borderColor: '#ffff00',
                  backgroundColor: '#333',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 1)',
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="memberClass" sx={{ color: '#ffff00' }}>
                Classe
              </InputLabel>
              <Select
                name="memberClass"
                value={player.memberClass}
                onChange={handleSelectChange}
                required
                sx={{
                  backgroundColor: '#444',
                  color: '#ffff00',
                  borderColor: '#ffff00',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#444',
                    borderColor: '#ffff00',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#444',
                    borderColor: '#ffff00',
                    boxShadow: '0 0 8px rgba(255, 255, 0, 1)',
                  },
                  '& .MuiSelect-icon': {
                    color: '#ffff00',
                  },
                  '& .MuiSelect-outlined': {
                    backgroundColor: '#444',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: '#444',
                    },
                  },
                }}
              >
                {["Arcanista", "Bárbaro", "Cavaleiro de Sangue", "Cruzado", "Caçador de Demônios", "Necromante", "Tempestário", "Monge", "Druida"].map((option) => (
                  <MenuItem key={option} value={option} sx={{ color: '#ffff00' }}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Telefone"
              name="phone"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: TextMaskCustom as any,
              }}
              value={player.phone}
              onChange={handleChange}
              // 'required' não é mais necessário aqui se o telefone for opcional
              sx={{
                input: {
                  color: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#ffff00',
                },
                '& .MuiOutlinedInput-root': {
                  borderColor: '#ffff00',
                  backgroundColor: '#444',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  borderColor: '#ffff00',
                  backgroundColor: '#333',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 1)',
                },
              }}
            />
            <TextField
              label="ID do Discord"
              name="discordId"
              fullWidth
              margin="normal"
              value={player.discordId}
              onChange={handleChange}
              // REMOVER O 'required' AQUI
              // required // <--- Remova esta linha
              sx={{
                input: {
                  color: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#ffff00',
                },
                '& .MuiOutlinedInput-root': {
                  borderColor: '#ffff00',
                  backgroundColor: '#444',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  borderColor: '#ffff00',
                  backgroundColor: '#333',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 1)',
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="cla" sx={{ color: '#ffff00' }}>
                Clã
              </InputLabel>
              <Select
                name="cla"
                value={player.cla}
                onChange={handleSelectChange}
                required
                sx={{
                  backgroundColor: '#444',
                  color: '#ffff00',
                  borderColor: '#ffff00',
                  boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#444',
                    borderColor: '#ffff00',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#444',
                    borderColor: '#ffff00',
                    boxShadow: '0 0 8px rgba(255, 255, 0, 1)',
                  },
                  '& .MuiSelect-icon': {
                    color: '#ffff00',
                  },
                  '& .MuiSelect-outlined': {
                    backgroundColor: '#444',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: '#444',
                    },
                  },
                }}
              >
                {["Chernobyl", "Maktub", "WarLords", "Arkyn", "Peste Negra"].map((option) => (
                  <MenuItem key={option} value={option} sx={{ color: '#ffff00' }}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" sx={{ marginTop: '16px' }}>
              <Button variant="contained" color="success" type="submit"
                sx={{
                  backgroundColor: '#ffff00',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#e5e500',
                  },
                }}
              >
                Cadastrar
              </Button>
            </FormControl>
          </form>
          <Divider sx={{ borderColor: '#ffff00', margin: '20px 0' }} />
          <FormControl fullWidth margin="normal" style={{ marginTop: '16px' }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="upload-csv"
              type="file"
              onChange={handleCSVUploadChange}
            />
            <label htmlFor="upload-csv">
              <Button variant="contained" component="span" color="secondary" sx={{
                backgroundColor: '#ff5722',
                '&:hover': {
                  backgroundColor: '#ff3d00',
                },
              }}>
                Importar Jogadores (CSV)
              </Button>
            </label>
          </FormControl>
        </Box>
        <Box
          component="img"
          src={logo}
          alt="Logo do Projeto"
          sx={{ width: '150px', height: 'auto', marginLeft: '20px' }}
        />
      </Box>

      {/* *** SNACKBAR *** */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};