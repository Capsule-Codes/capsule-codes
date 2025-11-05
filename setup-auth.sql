-- Script para configurar autenticación en Supabase
-- Ejecutar en Supabase SQL Editor

-- 1. Crear usuario admin
-- Nota: Este usuario se debe crear desde la interfaz de Supabase Auth
-- Ve a Authentication > Users > Add user
-- Email: admin@capsulecodes.com
-- Password: capsule2025
-- Auto Confirm User: true

-- 2. Crear tabla para roles de usuario (opcional, para futuras expansiones)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insertar rol de admin para el usuario
-- Reemplaza 'USER_ID_AQUI' con el ID real del usuario admin
-- INSERT INTO user_roles (user_id, role) VALUES ('USER_ID_AQUI', 'admin');

-- 4. Actualizar políticas RLS para que solo admins puedan modificar datos
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow public read access" ON technologies;
DROP POLICY IF EXISTS "Allow public read access" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage technologies" ON technologies;
DROP POLICY IF EXISTS "Allow authenticated users to manage reviews" ON reviews;

-- 5. Crear nuevas políticas más restrictivas
-- Lectura pública para todos
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON technologies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);

-- Solo admins pueden modificar datos
CREATE POLICY "Admin only projects" ON projects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admin only technologies" ON technologies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admin only reviews" ON reviews FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- 6. Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 7. Política para user_roles (solo admins pueden ver roles)
CREATE POLICY "Admin only user_roles" ON user_roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);
