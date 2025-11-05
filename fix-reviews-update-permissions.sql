-- Verificar las políticas RLS actuales para la tabla reviews
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'reviews';

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reviews;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON reviews;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON reviews;

-- Crear nuevas políticas RLS para reviews
CREATE POLICY "Enable read access for all users" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON reviews
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON reviews
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'reviews';
