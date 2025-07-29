import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './Routes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Theme } from './Theme';
ReactDOM.createRoot(document.getElementById('root')).render(_jsxs(ThemeProvider, { theme: Theme, children: [_jsx(CssBaseline, {}), _jsx(AppRoutes, {})] }));
