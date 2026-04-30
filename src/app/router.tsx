import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from '../feature/login/LoginPage';
import { MainLayout } from '../shared/layouts/MainLayout';
import { DashboardPage } from '../feature/dashboard/DashboardPage';
import { ProtectedRoute } from '../core/guards/ProtectedRoute';
import { ReservasPage } from '../feature/reservas/pages/ReservasPage';
import { NuevaReservaPage } from '../feature/reservas/pages/NuevaReservaPage';
import { UsuariosPage } from '../feature/usuarios/pages/UsuariosPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes inside MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Reservas Routes */}
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/reservas/nueva" element={<NuevaReservaPage />} />

            {/* Usuarios Routes */}
            <Route path="/usuarios" element={<UsuariosPage />} />
            
            {/* Placeholder for future routes */}
            <Route path="/seguridad" element={<div className="p-8">Módulo de Seguridad (WIP)</div>} />
            <Route path="/configuracion" element={<div className="p-8">Configuración (WIP)</div>} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
