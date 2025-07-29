import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/Pages/Register/Register.tsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Divider, Snackbar, Alert, LinearProgress, } from '@mui/material';
import { TextMaskCustom } from '../../Components/TextMaskCustom';
import { PageWrapper } from '../../Components/PageWrapper';
import logo from "../../Assets/chernobyl-logo.jpg";
import { handleCSVUpload as handleCSVImport } from './Register.utils';
// Importar o serviço da API
import membrosApi from '../../Services/membrosApi';
export const Register = () => {
    const [player, setPlayer] = useState({
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
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    // *** NOVO ESTADO PARA PROGRESS BAR ***
    const [importProgress, setImportProgress] = useState(0);
    const [isImporting, setIsImporting] = useState(false);
    // *** FUNÇÕES DO SNACKBAR ***
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlayer(prev => ({
            ...prev,
            [name]: name === 'resonance' ? parseFloat(value) : value
        }));
    };
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setPlayer(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            console.error("Erro ao cadastrar jogador:", error);
            // Mensagem de erro mais genérica, já que Discord ID pode não ser o problema
            showSnackbar("Erro ao cadastrar jogador. Verifique os dados e tente novamente.", "error");
        }
    };
    const handleCSVUploadChange = (event) => {
        setIsImporting(true);
        setImportProgress(0);
        handleCSVImport(event, showSnackbar, () => {
            // Callback após a importação do CSV
            setIsImporting(false);
            setImportProgress(0);
        }, (progress) => {
            // Callback de progresso
            setImportProgress(progress);
        });
    };
    return (_jsxs(PageWrapper, { children: [_jsxs(Box, { display: "flex", justifyContent: "center", alignItems: "center", width: "100%", children: [_jsxs(Box, { component: Paper, maxWidth: 500, p: 3, sx: {
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
                        }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: {
                                    color: '#ffff00',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px',
                                    textShadow: '0px 0px 10px rgba(255, 255, 0, 0.8)',
                                }, children: "Cadastro de Membros" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { label: "Nome", name: "name", fullWidth: true, margin: "normal", value: player.name, onChange: handleChange, required: true, sx: {
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
                                        } }), _jsx(TextField, { label: "Resson\u00E2ncia", name: "resonance", type: "number", fullWidth: true, margin: "normal", value: player.resonance, onChange: handleChange, required: true, sx: {
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
                                        } }), _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { htmlFor: "memberClass", sx: { color: '#ffff00' }, children: "Classe" }), _jsx(Select, { name: "memberClass", value: player.memberClass, onChange: handleSelectChange, required: true, sx: {
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
                                                }, MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            backgroundColor: '#444',
                                                        },
                                                    },
                                                }, children: ["Arcanista", "Bárbaro", "Cavaleiro de Sangue", "Cruzado", "Caçador de Demônios", "Necromante", "Tempestário", "Monge", "Druida"].map((option) => (_jsx(MenuItem, { value: option, sx: { color: '#ffff00' }, children: option }, option))) })] }), _jsx(TextField, { label: "Telefone", name: "phone", fullWidth: true, margin: "normal", InputProps: {
                                            inputComponent: TextMaskCustom,
                                        }, value: player.phone, onChange: handleChange, 
                                        // 'required' não é mais necessário aqui se o telefone for opcional
                                        sx: {
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
                                        } }), _jsx(TextField, { label: "ID do Discord", name: "discordId", fullWidth: true, margin: "normal", value: player.discordId, onChange: handleChange, 
                                        // REMOVER O 'required' AQUI
                                        // required // <--- Remova esta linha
                                        sx: {
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
                                        } }), _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { htmlFor: "cla", sx: { color: '#ffff00' }, children: "Cl\u00E3" }), _jsx(Select, { name: "cla", value: player.cla, onChange: handleSelectChange, required: true, sx: {
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
                                                }, MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            backgroundColor: '#444',
                                                        },
                                                    },
                                                }, children: ["Chernobyl", "Maktub", "WarLords", "Arkyn", "Peste Negra"].map((option) => (_jsx(MenuItem, { value: option, sx: { color: '#ffff00' }, children: option }, option))) })] }), _jsx(FormControl, { fullWidth: true, margin: "normal", sx: { marginTop: '16px' }, children: _jsx(Button, { variant: "contained", color: "success", type: "submit", sx: {
                                                backgroundColor: '#ffff00',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#e5e500',
                                                },
                                            }, children: "Cadastrar" }) })] }), _jsx(Divider, { sx: { borderColor: '#ffff00', margin: '20px 0' } }), _jsxs(FormControl, { fullWidth: true, margin: "normal", style: { marginTop: '16px' }, children: [_jsx("input", { accept: ".csv", style: { display: 'none' }, id: "upload-csv", type: "file", onChange: handleCSVUploadChange }), _jsx("label", { htmlFor: "upload-csv", children: _jsx(Button, { variant: "contained", component: "span", color: "secondary", disabled: isImporting, sx: {
                                                backgroundColor: '#ff5722',
                                                '&:hover': {
                                                    backgroundColor: '#ff3d00',
                                                },
                                                '&:disabled': {
                                                    backgroundColor: '#666',
                                                    color: '#999',
                                                },
                                            }, children: isImporting ? 'Importando...' : 'Importar Jogadores (CSV)' }) })] }), isImporting && (_jsxs(Box, { sx: { width: '100%', mt: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Box, { sx: { width: '100%', mr: 1 }, children: _jsx(LinearProgress, { variant: "determinate", value: importProgress, sx: {
                                                        backgroundColor: '#444',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#ffff00',
                                                        },
                                                    } }) }), _jsx(Box, { sx: { minWidth: 35 }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { color: '#ffff00' }, children: [Math.round(importProgress), "%"] }) })] }), _jsxs(Typography, { variant: "caption", sx: { color: '#ffff00' }, children: [importProgress < 25 && 'Validando arquivo...', importProgress >= 25 && importProgress < 75 && 'Processando dados...', importProgress >= 75 && importProgress < 100 && 'Enviando para servidor...', importProgress === 100 && 'Concluído!'] })] }))] }), _jsx(Box, { component: "img", src: logo, alt: "Logo do Projeto", sx: { width: '150px', height: 'auto', marginLeft: '20px' } })] }), _jsx(Snackbar, { open: snackbarOpen, autoHideDuration: 6000, onClose: handleCloseSnackbar, anchorOrigin: { vertical: 'bottom', horizontal: 'center' }, children: _jsx(Alert, { onClose: handleCloseSnackbar, severity: snackbarSeverity, sx: { width: '100%' }, variant: "filled", children: snackbarMessage }) })] }));
};
