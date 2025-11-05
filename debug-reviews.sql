-- Script para debuggear y verificar la tabla de reviews
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura de la tabla reviews
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reviews' 
ORDER BY ordinal_position;

-- 2. Verificar las políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'reviews';

-- 3. Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reviews';

-- 4. Verificar datos existentes
SELECT id, author, company, rating, created_at 
FROM reviews 
LIMIT 5;

-- 5. Verificar si hay problemas con el campo translations
SELECT id, author, 
       CASE 
         WHEN translations IS NULL THEN 'NULL'
         WHEN jsonb_typeof(translations) = 'object' THEN 'Valid JSONB'
         ELSE 'Invalid JSONB'
       END as translations_status
FROM reviews 
LIMIT 5;
