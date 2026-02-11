# ⚡ GUÍA RÁPIDA - COMPARACIÓN RUTAS

## 🎯 En 2 Minutos

### ¿Qué necesitas hacer?

Verificar que **cada ruta en el sistema Angular** tenga un **menú en la BD** y que ese menú esté **asignado al rol correcto**.

### Las 3 Capas

```
┌─────────────────────────────────────────────┐
│ CAPA 1: Angular Routes                      │
│ Dónde: src/app/app.routes.ts                │
│ Qué: Define las URLs disponibles            │
└─────────────────┬───────────────────────────┘
                  │ Cada ruta debe tener
                  │ su correspondencia en BD
                  ↓
┌─────────────────────────────────────────────┐
│ CAPA 2: Tabla Menus (BD)                    │
│ Dónde: base de datos                        │
│ Qué: Describe cada menú                     │
│      (id, descripcion, icono, ruta)         │
└─────────────────┬───────────────────────────┘
                  │ Cada menú debe estar
                  │ asignado a roles
                  ↓
┌─────────────────────────────────────────────┐
│ CAPA 3: Tabla MenuRoles (BD)                │
│ Dónde: base de datos                        │
│ Qué: Asigna menús a roles                   │
│      (idMenu, idRol, permiso, estado)       │
└─────────────────────────────────────────────┘
```

---

## 🚀 PASO A PASO

### PASO 1: Listar todas las rutas del sistema

**Archivo:** [src/app/app.routes.ts](src/app/app.routes.ts)

Busca todas las líneas con `path:` dentro de la sección de `children`:

```typescript
// app.routes.ts - children section
path: 'pages/persona',     ← RUTA 1
path: 'pages/tipo-documento', ← RUTA 2
path: 'pages/menu',        ← RUTA 3
path: 'pages/rol',         ← RUTA 4
// etc...
```

**Archivo:** [src/app/pages/pages.routes.ts](src/app/pages/pages.routes.ts)

Busca más rutas:

```typescript
// pages.routes.ts
path: 'user',              ← RUTA 5
path: 'entidad',           ← RUTA 6
path: 'aplicacion',        ← RUTA 7
path: 'unidadOrganica',    ← RUTA 8
```

### PASO 2: **Listar rutas en BD**

Ejecuta en tu base de datos:

```sql
SELECT id, descripcion, ruta 
FROM Menus
ORDER BY ruta;
```

✅ **Compara:** 
- ¿Están TODAS las rutas del PASO 1?
- ¿Con el mismo nombre?
- ¿Con el prefijo `/pages/` correcto?

### PASO 3: **Verificar asignación por rol**

Para cada rol importante, ejecuta:

```sql
-- SUPERADMIN
SELECT COUNT(*) as cantidad_menus
FROM MenuRoles
WHERE idRol = 'SUPERADMIN' AND estado = 1;

-- ADMIN
SELECT COUNT(*) as cantidad_menus
FROM MenuRoles
WHERE idRol = 'ADMIN' AND estado = 1;

-- USER  
SELECT COUNT(*) as cantidad_menus
FROM MenuRoles
WHERE idRol = 'USER' AND estado = 1;
```

### PASO 4: **Probar navegación**

1. Ingresa como SUPERADMIN
2. ¿Ves todos los menús esperados?
3. ¿Haces clic y navega bien?
4. Repite con ADMIN y USER

---

## ✅ LISTA DE VERIFICACIÓN

|  | Verificación | Sí | No |
|--|--------------|----|----|
| 1 | ¿Todas las rutas en app.routes.ts existen en tabla Menus? | ☐ | ☐ |
| 2 | ¿Todas las rutas en pages.routes.ts existen en tabla Menus? | ☐ | ☐ |
| 3 | ¿Todas las rutas en Menus comienzan con `/`? | ☐ | ☐ |
| 4 | ¿Cada menú tiene al menos 1 MenuRoles? | ☐ | ☐ |
| 5 | ¿MenuRoles.estado = 1 para menús activos? | ☐ | ☐ |
| 6 | ¿SUPERADMIN ve 8 menús? | ☐ | ☐ |
| 7 | ¿ADMIN ve 4 menús? | ☐ | ☐ |
| 8 | ¿USER ve 1 menú? | ☐ | ☐ |
| 9 | ¿No hay rutas con espacios en blanco? | ☐ | ☐ |
| 10 | ¿No hay rutas duplicadas? | ☐ | ☐ |

---

## 🔍 SI ALGO FALLA

### ❌ "No veo menú X para rol Y"

**Causa posible:** MenuRol no existe o estado=0

```sql
-- Verificar
SELECT * FROM MenuRoles
WHERE idMenu = (SELECT id FROM Menus WHERE ruta = '/pages/persona')
AND idRol = 'USER';

-- Si no devuelve nada o estado=0, agregar o activar:
UPDATE MenuRoles
SET estado = 1
WHERE idMenu = ... AND idRol = 'USER';
```

### ❌ "Código rompe al navegar"

**Causa posible:** Ruta en menú no existe en routes

```sql
-- Detectar rutas que no existen
SELECT ruta FROM Menus
WHERE ruta NOT IN (
    '/pages/persona', '/pages/tipo-documento', '/pages/menu', '/pages/rol',
    '/pages/user', '/pages/entidad', '/pages/aplicacion', '/pages/unidadOrganica'
);
```

### ❌ "Ruta existe pero no aparece en menú"

**Causa posible:** No existe menú o menú no asignado a rol

```sql
-- Ver si existe menú
SELECT * FROM Menus WHERE ruta = '/pages/persona';

-- Si no existe, crear:
INSERT INTO Menus (descripcion, icono, ruta, idAplicacion)
VALUES (N'Personas', 'icon-people', '/pages/persona', 1);

-- Obtener ID generado y asignar:
INSERT INTO MenuRoles (idMenu, idRol, estado)
VALUES ((SELECT id FROM Menus WHERE ruta = '/pages/persona'), 'USER', 1);
```

---

## 📌 REFERENCIAS RÁPIDAS

### Archivos TypeScript principales

| Archivo | Línea | Descripción |
|---------|-------|-------------|
| [app.routes.ts](src/app/app.routes.ts#L66) | 66-118 | Rutas principales |
| [pages.routes.ts](src/app/pages/pages.routes.ts#L1) | 1-75 | Rutas child |
| [menu.service.ts](src/app/service/menu.service.ts#L37) | 37-45 | Obtener menús |
| [app.component.ts](src/app/app.component.ts#L130) | 130+ | Usar menús |
| [header.component.ts](src/app/layouts/full/vertical/header/header.component.ts#L195) | 195+ | Cambiar rol |

### Modelos

| Modelo | Archivo | Campo Crítico |
|--------|---------|---------------|
| MenuInfo | [menu.ts](src/app/model/menu.ts#L30) | `ruta` |
| MenuRol | [menu.ts](src/app/model/menu.ts#L23) | `ruta`, `idRol` |
| Menu | [menu.ts](src/app/model/menu.ts#L3) | `ruta` |

---

## 🎯 RESUMEN DE RUTAS

### Rutas que DEBEN estar en Menus

```
✅ /pages/persona
✅ /pages/tipo-documento
✅ /pages/menu
✅ /pages/rol
✅ /pages/user
✅ /pages/entidad
✅ /pages/aplicacion
✅ /pages/unidadOrganica
```

### Rutas que NO deben estar en Menus

```
❌ /login
❌ /register
❌ /forgot-password
❌ /reset-password
❌ /change-password
❌ /pages/user/unidadorganica-user/:id (es subruta)
```

### Cuántos menús por rol (ESPERADO)

```
SUPERADMIN: 8 menús (todos)
ADMIN:      4 menús (persona, user, unidadOrganica, tipo-documento)
USER:       1 menú (persona)
```

---

## 📞 ¿Necesitas más detalle?

- **Análisis completo:** [ANALISIS_RUTAS_MENU_VS_ROUTES.md](ANALISIS_RUTAS_MENU_VS_ROUTES.md)
- **Validador con queries:** [VALIDADOR_RUTAS_MENU_BD.md](VALIDADOR_RUTAS_MENU_BD.md)
- **Matriz visual:** [MATRIZ_MAPEO_RUTAS_MENUS_ROLES.md](MATRIZ_MAPEO_RUTAS_MENUS_ROLES.md)

---

**Última actualización:** 2026-02-11  
**Tiempo para revisar:** 10-15 minutos  
**Dificultad:** 🟢 Fácil
