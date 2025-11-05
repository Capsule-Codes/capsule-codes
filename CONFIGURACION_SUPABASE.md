# 🔧 Configuración de Supabase

## ¿Por qué aparece "Error loading reviews"?

El error aparece porque el proyecto está configurado para usar Supabase como base de datos, pero las variables de entorno no están configuradas.

## 📋 Pasos para Configurar Supabase

### 1. Crear un archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aqui
```

### 2. Obtener las credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Ve a **Settings** → **API**
5. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar la base de datos

1. Ve a tu proyecto de Supabase
2. Ve a **SQL Editor**
3. Ejecuta el contenido del archivo `supabase-schema.sql`
4. Esto creará las tablas necesarias

### 4. Configurar políticas de seguridad

Las políticas ya están incluidas en el script SQL, pero puedes verificar en **Authentication** → **Policies** que estén activas.

## 🚀 Alternativa: Usar datos mock

Si no quieres configurar Supabase ahora, puedes:

1. **Comentar la sección de reviews** temporalmente en `app/page.tsx`
2. **O usar el data-context original** en lugar de Supabase

## 📁 Archivos importantes

- `lib/supabase.ts` - Cliente de Supabase
- `lib/supabase-context.tsx` - Contexto para datos
- `supabase-schema.sql` - Script para crear tablas
- `components/reviews-carousel.tsx` - Componente del carousel

## ✅ Verificación

Una vez configurado correctamente, deberías ver:

- ✅ Las reseñas se cargan desde Supabase
- ✅ El admin panel funciona con la base de datos
- ✅ Los cambios se sincronizan en tiempo real

## 🆘 Solución Rápida

Si quieres desactivar temporalmente las reviews:

```tsx
// En app/page.tsx, comenta esta línea:
// <ReviewsSection />
```

Esto eliminará la sección de reviews hasta que configures Supabase.
