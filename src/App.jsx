import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

// Páginas públicas
import Adoptar from './pages/public/Adoptar'
import MeInteresa from './pages/public/MeInteresa'
import Voluntariado from './pages/public/Voluntariado'
import Donaciones from './pages/public/Donaciones'
import Nosotros from './pages/public/Nosotros'
import Politica from './pages/public/Politica'

// Páginas admin
import AdminAnimales from './pages/admin/AdminAnimales'
import AdminAdopciones from './pages/admin/AdminAdopciones'
import AdminVoluntarios from './pages/admin/AdminVoluntarios'
import AdminNuevoAnimal from './pages/admin/AdminNuevoAnimal'
import AdminLogin from './pages/admin/AdminLogin'

// Guard de autenticación (lo implementamos después)
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Adoptar />} />
        <Route path="me-interesa" element={<MeInteresa />} />
        <Route path="voluntariado" element={<Voluntariado />} />
        <Route path="donaciones" element={<Donaciones />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="/politica-de-privacidad" element={<Politica />} />
      </Route>

      {/* Login admin */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Rutas admin protegidas */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/animales" replace />} />
        <Route path="animales" element={<AdminAnimales />} />
        <Route path="adopciones" element={<AdminAdopciones />} />
        <Route path="voluntarios" element={<AdminVoluntarios />} />
        <Route path="nuevo-animal" element={<AdminNuevoAnimal />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
