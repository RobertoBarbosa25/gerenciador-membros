import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/Routes.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '../Pages/Home';
import { Register } from '../Pages/Register';
import { Members } from '../Pages/Members/Members'; // <--- CORREÇÃO AQUI: Importa diretamente o arquivo MemberList.tsx
// Se o seu arquivo Members.tsx original continha tudo, e foi renomeado, o caminho seria:
// import { MemberList } from '../Pages/Members/Members'; // Se você tinha um Members.tsx que virou MemberList.tsx
import { Towers } from '../Pages/Towers';
import { NavigationMenu } from '../Components/Menu/Menu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RitoPage } from '../Pages/Rito';
import { VigiliaPage } from '../Pages/Vigilia';
import { Gestao } from '../Pages/Gestao';
export const AppRoutes = () => {
    return (_jsxs(BrowserRouter, { children: [location.pathname !== '/login' && _jsx(NavigationMenu, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/members", element: _jsx(Members, {}) }), " ", _jsx(Route, { path: "/towers", element: _jsx(Towers, {}) }), _jsx(Route, { path: "/rito", element: _jsx(RitoPage, {}) }), _jsx(Route, { path: "/vigilia", element: _jsx(VigiliaPage, {}) }), _jsx(Route, { path: "/gestao", element: _jsx(Gestao, {}) })] }), _jsx(ToastContainer, {})] }));
};
