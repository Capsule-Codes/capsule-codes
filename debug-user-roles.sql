-- Script para debuggear la tabla user_roles
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que la tabla user_roles existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_roles';

-- 2. Verificar la estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_roles';

-- 3. Verificar si hay datos en user_roles
SELECT * FROM user_roles;

-- 4. Verificar específicamente el usuario admin
SELECT ur.*, u.email 
FROM user_roles ur 
JOIN auth.users u ON ur.user_id = u.id 
WHERE u.email = 'admin@capsulecodes.com';

-- 5. Verificar si el usuario existe en auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@capsulecodes.com';
