import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, } from '@mui/material';
import { PageWrapper } from '../../Components/PageWrapper';
import logo from '../../Assets/chernobyl-logo.jpg';
import { useNavigate } from 'react-router-dom';
export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica de autenticação
        console.log('Username:', username);
        console.log('Password:', password);
    };
    return (_jsx(PageWrapper, { children: _jsxs(Box, { display: "flex", justifyContent: "center", alignItems: "center", width: "100%", children: [_jsxs(Paper, { elevation: 3, style: { padding: '20px', maxWidth: '400px', width: '100%' }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, align: "center", children: "Login" }), _jsxs("form", { onSubmit: handleLogin, children: [_jsx(TextField, { label: "Nome de Usu\u00E1rio", variant: "outlined", fullWidth: true, margin: "normal", value: username, onChange: (e) => setUsername(e.target.value), required: true }), _jsx(TextField, { label: "Senha", type: "password", variant: "outlined", fullWidth: true, margin: "normal", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", fullWidth: true, style: { marginTop: '16px' }, onClick: () => navigate("/register"), children: "Entrar" })] })] }), _jsx(Box, { component: "img", src: logo, alt: "Logo do Projeto", sx: { width: '150px', height: 'auto', marginLeft: '20px' } })] }) }));
};
