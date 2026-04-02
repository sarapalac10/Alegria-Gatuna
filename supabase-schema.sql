-- ══════════════════════════════════════════
-- ALEGRÍA GATUNA — Schema de base de datos
-- Pega esto en: Supabase → SQL Editor → Run
-- ══════════════════════════════════════════


-- ── 1. ANIMALES ────────────────────────────
create table animales (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  especie       text not null check (especie in ('gato','perro','conejo','otro')),
  sexo          text not null check (sexo in ('macho','hembra')),
  edad          text,                        -- ej: "2 años", "8 meses"
  raza          text,
  descripcion   text,
  foto_url      text,                        -- URL del archivo en Supabase Storage
  vacunado      boolean default false,
  desparasitado boolean default false,
  esterilizado  boolean default false,
  con_animales  boolean default false,       -- compatible con otros animales
  con_ninos     boolean default false,       -- compatible con niños
  estado        text not null default 'disponible'
                check (estado in ('disponible','en_proceso','reservado','adoptado')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Trigger para actualizar updated_at automáticamente
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger animales_updated_at
  before update on animales
  for each row execute function set_updated_at();


-- ── 2. SOLICITUDES DE ADOPCIÓN ─────────────
create table solicitudes_adopcion (
  id            uuid primary key default gen_random_uuid(),
  animal_id     uuid references animales(id) on delete set null,
  nombre        text not null,
  apellido      text not null,
  correo        text not null,
  celular       text not null,
  descripcion_hogar text,
  tiene_espacio boolean default false,
  todos_acuerdo boolean default false,
  compromiso_vet boolean default false,
  etapa         text not null default 'solicitud'
                check (etapa in ('solicitud','entrevista','visita_hogar','aprobacion','entrega','rechazado')),
  notas_admin   text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger solicitudes_updated_at
  before update on solicitudes_adopcion
  for each row execute function set_updated_at();


-- ── 3. VOLUNTARIOS ─────────────────────────
create table voluntarios (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  correo        text not null,
  tipo          text not null
                check (tipo in ('cuidado_directo','hogar_transito','apoyo_veterinario','difusion_redes')),
  disponibilidad text,                       -- ej: "4-8 horas"
  motivacion    text,
  estado        text not null default 'pendiente'
                check (estado in ('pendiente','activo','inactivo')),
  created_at    timestamptz default now()
);


-- ── 4. STORAGE para fotos de animales ──────
-- Crear el bucket manualmente en:
-- Supabase → Storage → New bucket → "animales" → Public: true


-- ── 5. ROW LEVEL SECURITY (RLS) ────────────

-- Habilitar RLS en todas las tablas
alter table animales              enable row level security;
alter table solicitudes_adopcion  enable row level security;
alter table voluntarios           enable row level security;

-- Animales: cualquiera puede leer, solo admin puede escribir
create policy "animales_lectura_publica"
  on animales for select using (true);

create policy "animales_escritura_admin"
  on animales for all
  using (auth.role() = 'authenticated');

-- Solicitudes: cualquiera puede insertar, solo admin puede leer/editar
create policy "solicitudes_insertar_publico"
  on solicitudes_adopcion for insert with check (true);

create policy "solicitudes_admin"
  on solicitudes_adopcion for select
  using (auth.role() = 'authenticated');

create policy "solicitudes_update_admin"
  on solicitudes_adopcion for update
  using (auth.role() = 'authenticated');

-- Voluntarios: cualquiera puede insertar, solo admin puede leer/editar
create policy "voluntarios_insertar_publico"
  on voluntarios for insert with check (true);

create policy "voluntarios_admin"
  on voluntarios for select
  using (auth.role() = 'authenticated');

create policy "voluntarios_update_admin"
  on voluntarios for update
  using (auth.role() = 'authenticated');


-- ── 6. DATOS DE PRUEBA ─────────────────────
insert into animales (nombre, especie, sexo, edad, descripcion, estado, vacunado, desparasitado, esterilizado, con_animales, con_ninos)
values
  ('Luna',  'gato',  'hembra', '1 año',    'Gatita juguetona y cariñosa. Le encanta dormir en el sol y perseguir juguetes.', 'disponible', true, true, true, true, true),
  ('Mango', 'perro', 'macho',  '2 años',   'Perro activo y social. Ama los paseos largos y los mimos sin límite.',            'disponible', true, true, false, true, true),
  ('Paco',  'perro', 'macho',  '4 años',   'Tranquilo y leal. Perfecto para una familia con espacio exterior.',               'en_proceso', true, true, true, false, true),
  ('Michi', 'gato',  'macho',  '3 años',   'Independiente pero muy curioso. Perfecto para apartamento.',                     'disponible', true, true, true, true, false),
  ('Nube',  'conejo','hembra', '8 meses',  'Conejita suave y tranquila. Ideal para casa con jardín o zona de juegos.',        'disponible', true, true, false, false, true),
  ('Bola',  'perro', 'hembra', '6 años',   'Perita adulta, calmada y agradecida. Sabe dar la pata y es muy obediente.',       'reservado',  true, true, true, true, true);
