-- Script para agregar la columna translations a la tabla technologies
-- Ejecutar en el SQL Editor de Supabase ANTES del seed-technologies.sql

-- Agregar la columna translations a la tabla technologies
ALTER TABLE technologies 
ADD COLUMN translations JSONB DEFAULT '{
  "en": {"name": "", "description": ""},
  "es": {"name": "", "description": ""},
  "it": {"name": "", "description": ""}
}';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'technologies' 
AND column_name = 'translations';
