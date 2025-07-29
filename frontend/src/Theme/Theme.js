import { createTheme } from '@mui/material';
export const Theme = createTheme({
    typography: {
        fontFamily: [
            'Roboto',
            'ShatteredFate'
        ].join(','),
        body1: {
            fontSize: 16,
            fontFamily: "Roboto"
        },
        body2: {
            fontSize: 16,
            fontFamily: "Roboto"
        },
        h1: {
            fontWeight: 'bold',
            fontFamily: ["ShatteredFate", "Roboto"].join(",")
        },
        h2: {
            fontWeight: 'bold',
        },
    },
    palette: {
        primary: {
            main: '#010101',
            contrastText: "#fff"
        },
        secondary: {
            main: '#010101',
            contrastText: "#fff"
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontSize: 16,
                    letterSpacing: 2,
                    background: "#2d2d2d",
                    "& ::-webkit-scrollbar": {
                        width: 12,
                    },
                    "& ::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: 6,
                    },
                    "& ::-webkit-scrollbar-thumb": {
                        background: "#2d2d2d",
                        borderRadius: 6,
                    },
                    "& ::-webkit-scrollbar-thumb:hover": {
                        background: "#000"
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    background: "#2d2d2d",
                    "& th": {
                        color: "#fff",
                        "& a:link, & a:visited": {
                            color: "#fff",
                            textDecoration: "none",
                            "&::after": {
                                content: "'*'"
                            }
                        }
                    }
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&.monge": {
                        background: "#B2D8B2"
                    },
                    "&.arcanista": {
                        background: "#A3C1E0"
                    },
                    "&.barbaro": {
                        background: "#8B5B29",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                    "&.cavaleirodesangue": {
                        background: "#C62828",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                    "&.cruzado": {
                        background: "#F2B2D4"
                    },
                    "&.cacadordedemonios": {
                        background: "#E57373"
                    },
                    "&.necromante": {
                        background: "#9B59B6",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                    "&.tempestario": {
                        background: "#3498DB",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    "& > div": {
                        padding: 4,
                        backgroundColor: "#fff"
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    "& a:link, & a:visited": {
                        color: "#000",
                        textDecoration: "none",
                    },
                    "&.monge": {
                        background: "#B2D8B2"
                    },
                    "&.arcanista": {
                        background: "#A3C1E0"
                    },
                    "&.barbaro": {
                        background: "#8B5B29",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                    "&.cavaleirodesangue": {
                        background: "#C62828",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                    "&.cruzado": {
                        background: "#F2B2D4"
                    },
                    "&.cacadordedemonios": {
                        background: "#E57373"
                    },
                    "&.necromante": {
                        background: "#9B59B6",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                    "&.tempestario": {
                        background: "#3498DB",
                        "& td": {
                            color: "#fff !important",
                        }
                    },
                }
            }
        }
    },
});
