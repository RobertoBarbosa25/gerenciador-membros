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
  return (
    <BrowserRouter>
      {location.pathname !== '/login' && <NavigationMenu />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/members" element={<Members />} /> {/* <--- USA SEU COMPONENTE MemberList */}
        <Route path="/towers" element={<Towers />} />
        <Route path="/rito" element={<RitoPage />} />
        <Route path="/vigilia" element={<VigiliaPage />} />
        <Route path="/gestao" element={<Gestao />} /> 
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};