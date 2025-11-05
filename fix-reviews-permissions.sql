-- Script para arreglar permisos y políticas de la tabla reviews
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar y recrear políticas RLS para reviews
DROP POLICY IF EXISTS "Allow public read access" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated users to manage reviews" ON reviews;

-- 2. Crear políticas más permisivas para desarrollo
CREATE POLICY "Allow public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON reviews FOR DELETE USING (true);

-- 3. Verificar que RLS esté habilitado
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. Verificar permisos de la tabla
GRANT ALL ON reviews TO anon;
GRANT ALL ON reviews TO authenticated;

-- 5. Verificar que el trigger de updated_at funcione
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'reviews';
