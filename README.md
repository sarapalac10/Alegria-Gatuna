# 🏠 Alegría Gatuna

Plataforma web para gestión del hogar de paso animal Alegría Gatuna, Medellín.

## Stack

- **Frontend**: React + Vite
- **Base de datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (fotos de animales)
- **Hosting**: Vercel

---

## Cómo arrancar el proyecto

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/alegria-gatuna.git
cd alegria-gatuna
npm install
```

### 2. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y pegar el contenido de `supabase-schema.sql`
3. Ir a **Storage** → New bucket → nombre: `animales` → marcar como **Public**
4. Ir a **Settings → API** y copiar la URL y la `anon key`

### 3. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Crear usuario administrador

En Supabase → **Authentication → Users → Add user**:
- Email: el correo del admin
- Password: contraseña segura

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/          # PublicLayout, AdminLayout, ProtectedRoute
│   ├── ui/              # Componentes reutilizables (Button, Badge, etc.)
│   ├── public/          # Componentes específicos de la vista pública
│   └── admin/           # Componentes específicos del admin
├── pages/
│   ├── public/          # Adoptar, MeInteresa, Voluntariado, Donaciones, Nosotros
│   └── admin/           # AdminAnimales, AdminAdopciones, AdminVoluntarios, etc.
├── lib/
│   └── supabase.js      # Cliente de Supabase
├── hooks/               # Custom hooks (useAnimales, useSolicitudes, etc.)
└── assets/              # Imágenes y recursos estáticos
```

## Deploy en Vercel

1. Conectar el repo de GitHub en [vercel.com](https://vercel.com)
2. Agregar las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Deploy automático en cada push a `main` ✅

---

## Rutas

| Ruta | Vista |
|------|-------|
| `/` | Galería de animales en adopción |
| `/me-interesa` | Formulario de solicitud de adopción |
| `/voluntariado` | Info y formulario de voluntariado |
| `/donaciones` | Métodos de donación |
| `/nosotros` | Historia, impacto y testimonios |
| `/admin` | Panel de administración (protegido) |
| `/admin/animales` | Gestión de animales |
| `/admin/adopciones` | Seguimiento de procesos |
| `/admin/voluntarios` | Lista de voluntarios |
| `/admin/nuevo-animal` | Subir nuevo animal |
