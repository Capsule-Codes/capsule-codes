# Configuración de Supabase

## 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aqui
```

## 2. Configurar Base de Datos

1. Ve a tu proyecto de Supabase
2. Ve a la sección "SQL Editor"
3. Ejecuta el contenido del archivo `supabase-schema.sql` para crear las tablas

## 3. Configurar Políticas de Seguridad (RLS)

Las políticas ya están incluidas en el script SQL, pero puedes verificar que estén activas:

- **Lectura pública**: Todos pueden leer projects, technologies y reviews
- **Escritura autenticada**: Solo usuarios autenticados pueden crear/editar/eliminar

## 4. Estructura de Tablas

### Projects

- `id` (UUID, Primary Key)
- `title` (TEXT)
- `description` (TEXT)
- `translations` (JSONB) - Contenido multilingüe
- `image` (TEXT)
- `technologies` (TEXT[])
- `live_url` (TEXT, opcional)
- `github_url` (TEXT, opcional)
- `category` (TEXT) - 'web', 'mobile', 'fullstack'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Technologies

- `id` (UUID, Primary Key)
- `name` (TEXT)
- `category` (TEXT) - 'frontend', 'backend', 'mobile', 'database', 'deployment'
- `icon` (TEXT)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Reviews

- `id` (UUID, Primary Key)
- `text` (TEXT)
- `author` (TEXT)
- `company` (TEXT)
- `position` (TEXT)
- `translations` (JSONB) - Contenido multilingüe
- `rating` (INTEGER) - 1-5 estrellas
- `avatar` (TEXT, opcional)
- `date` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 5. Funcionalidades Implementadas

### Admin Panel

- ✅ **Gestión de Proyectos**: CRUD completo con soporte multilingüe
- ✅ **Gestión de Tecnologías**: CRUD completo
- ✅ **Gestión de Reviews**: CRUD completo con soporte multilingüe
- ✅ **Estados de carga**: Indicadores de loading y error
- ✅ **Sincronización en tiempo real**: Los cambios se reflejan inmediatamente

### Características

- ✅ **Soporte multilingüe**: EN/ES/IT para todos los contenidos
- ✅ **Validación de datos**: Tipos y restricciones en la base de datos
- ✅ **Manejo de errores**: Estados de error y reintentos
- ✅ **Optimistic updates**: La UI se actualiza inmediatamente
- ✅ **Triggers automáticos**: `updated_at` se actualiza automáticamente

## 6. Próximos Pasos

1. **Configurar las variables de entorno** con tus credenciales de Supabase
2. **Ejecutar el script SQL** para crear las tablas
3. **Probar el admin panel** para verificar que todo funciona
4. **Implementar autenticación** si es necesario para el admin
5. **Crear el carousel de reviews** en la landing page

## 7. Notas Importantes

- El proyecto ahora usa Supabase como backend en lugar de localStorage
- Los datos se sincronizan automáticamente con la base de datos
- Las operaciones son asíncronas y manejan errores apropiadamente
- El admin panel incluye indicadores de carga y estados de error
