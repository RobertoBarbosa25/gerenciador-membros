import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { PageWrapper } from '../../Components/PageWrapper';
import logo from '../../Assets/chernobyl-logo.jpg';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="center" alignItems="center" width="100%">
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
          <Typography variant="h5" gutterBottom align="center">
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Nome de Usuário"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '16px' }}
              onClick={()=>navigate("/register")}
            >
              Entrar
            </Button>
          </form>
        </Paper>
        <Box
          component="img"
          src={logo}
          alt="Logo do Projeto"
          sx={{ width: '150px', height: 'auto', marginLeft: '20px' }} // ajuste o tamanho conforme necessário
        />
      </Box>
    </PageWrapper>
  );
};
