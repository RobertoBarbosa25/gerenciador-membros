import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
export const NavigationMenu = () => {
    return (_jsx(AppBar, { position: "static", children: _jsxs(Toolbar, { children: [_jsx(Button, { color: "inherit", component: Link, to: "/", children: "Home" }), _jsx(Button, { color: "inherit", component: Link, to: "/register", children: "Registrar" }), _jsx(Button, { color: "inherit", component: Link, to: "/members", children: "Membros" }), _jsx(Button, { color: "inherit", component: Link, to: "/towers", children: "Torres" }), _jsx(Button, { color: "inherit", component: Link, to: "/rito", children: "Rito" }), _jsx(Button, { color: "inherit", component: Link, to: "/vigilia", children: "Vig\u00EDlia" }), _jsx(Button, { color: "inherit", component: Link, to: "/gestao", children: "Gest\u00E3o" })] }) }));
};
