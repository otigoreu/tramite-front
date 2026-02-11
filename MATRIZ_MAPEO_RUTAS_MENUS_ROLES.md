# 🗺️ MATRIZ DE MAPEO: RUTAS ↔ MENÚS ↔ ROLES

## Vista General del Ecosistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR ROUTES (app.routes.ts)                │
└─────────────────────────────────────────────────────────────────┘
                                ↓
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
   [PUBLIC]              [PROTECTED]              [PROTECTED-CHILD]
   /login                /pages/persona           /pages/user
   /register             /pages/rol               /pages/entidad
   /forgot-pwd           /pages/menu              /pages/aplicacion
   /reset-pwd            /pages/tipo-documento    /pages/unidadOrganica
   /change-pwd           

                                ↓
┌─────────────────────────────────────────────────────────────────┐
│              MENUS TABLE (Base de Datos)                         │
│  id | descripcion | icono | ruta | idAplicacion | idMenuPadre   │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│          MENUROLES TABLE (Asignación a Roles)                    │
│  id | idMenu | idRol | estado | operacion | consulta             │
└─────────────────────────────────────────────────────────────────┘
                                ↓
        ┌────────────┬──────────────┬──────────────┐
        ↓            ↓              ↓              ↓
   [SUPERADMIN] [ADMIN]      [USER]         [GUEST]
   (8 menús)   (4 menús)    (1 menú)      (ninguno)
```

---

## 📋 MATRIZ DETALLADA: RUTAS Y PERMISOS

### Leyenda
- ✅ = Debe existir en menú
- ❓ = Opcional/Contextual
- ❌ = No debe estar en menú
- 🔐 = Requiere autenticación
- 🌍 = Acceso público

### Tabla Principal

| Ruta | Componente | Tipo | Público | Menú | SUPERADMIN | ADMIN | USER | Estado |
|------|-----------|------|---------|------|-----------|-------|------|--------|
| `/login` | LoginComponent | Auth | 🌍 | ❌ | N/A | N/A | N/A | ✅ |
| `/register` | RegisterComponent | Auth | 🌍 | ❌ | N/A | N/A | N/A | ✅ |
| `/forgot-password` | ForgotPasswordComponent | Auth | 🌍 | ❌ | N/A | N/A | N/A | ✅ |
| `/reset-password` | ResetPasswordComponent | Auth | 🌍 | ❌ | N/A | N/A | N/A | ✅ |
| `/change-password` | ChangePasswordComponent | Auth | 🌍 | ❓ | N/A | N/A | N/A | ✅ |
| **`/pages/persona`** | PersonaComponent | CRUD | 🔐 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **`/pages/tipo-documento`** | TipoDocumentoComponent | Catálogo | 🔐 | ✅ | ✅ | ✅ | ❓ | ✅ |
| **`/pages/menu`** | MenuComponent | Admin | 🔐 | ✅ | ✅ | ❌ | ❌ | ✅ |
| **`/pages/rol`** | RolComponent | Admin | 🔐 | ✅ | ✅ | ❌ | ❌ | ✅ |
| **`/pages/user`** | UserComponent | Admin | 🔐 | ✅ | ✅ | ✅ | ❌ | ✅ |
| **`/pages/entidad`** | EntidadComponent | Admin | 🔐 | ✅ | ✅ | ❌ | ❌ | ✅ |
| **`/pages/aplicacion`** | AplicacionComponent | Admin | 🔐 | ✅ | ✅ | ❌ | ❌ | ✅ |
| **`/pages/unidadOrganica`** | UnidadorganicaComponent | Org | 🔐 | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/pages/user/unidadorganica-user/:id` | UnidadorganicaUserComponent | Detail | 🔐 | ❌ | Subruta | Subruta | Subruta | ✅ |

---

## 👥 MATRIZ POR ROL

### SUPERADMIN (Control Total)

```
┌────────────────────────────────────────────────┐
│ SUPERADMIN - Todas las funcionalidades         │
├────────────────────────────────────────────────┤
│ [8 MENÚS TOTALES]                              │
├────────────────────────────────────────────────┤
│ 1. 📑 /pages/entidad           [C R U D]       │
│ 2. 🎯 /pages/aplicacion        [C R U D]       │
│ 3. 👥 /pages/rol               [C R U D]       │
│ 4. 📋 /pages/menu              [C R U D]       │
│ 5. 👨 /pages/user              [C R U D]       │
│ 6. 🏢 /pages/unidadOrganica    [C R U D]       │
│ 7. 🧑 /pages/persona           [C R U D]       │
│ 8. 📄 /pages/tipo-documento    [C R U D]       │
├────────────────────────────────────────────────┤
│ Permisos: Operación ✅ | Consulta ✅           │
└────────────────────────────────────────────────┘
```

**Query para validar:**
```sql
SELECT COUNT(*) as TotalMenus
FROM MenuRoles
WHERE idRol = (SELECT id FROM [Roles] WHERE name = 'SUPERADMIN')
AND estado = 1;

-- Esperado: 8
```

---

### ADMIN (Administración de Entidad)

```
┌────────────────────────────────────────────────┐
│ ADMIN - Gestión de datos de la entidad         │
├────────────────────────────────────────────────┤
│ [4 MENÚS TOTALES]                              │
├────────────────────────────────────────────────┤
│ 1. 🧑 /pages/persona           [C R U D]       │
│ 2. 👥 /pages/user              [C R U D]       │
│ 3. 🏢 /pages/unidadOrganica    [R U]           │
│ 4. 📄 /pages/tipo-documento    [R]             │
├────────────────────────────────────────────────┤
│ Permisos: Operación ✅ | Consulta ✅           │
└────────────────────────────────────────────────┘
```

**Query para validar:**
```sql
SELECT COUNT(*) as TotalMenus
FROM MenuRoles
WHERE idRol = (SELECT id FROM [Roles] WHERE name = 'ADMIN')
AND estado = 1;

-- Esperado: 4
```

---

### USER (Usuario Regular)

```
┌────────────────────────────────────────────────┐
│ USER - Funcionalidad limitada                  │
├────────────────────────────────────────────────┤
│ [1 MENÚ TOTAL]                                 │
├────────────────────────────────────────────────┤
│ 1. 🧑 /pages/persona           [C]             │
├────────────────────────────────────────────────┤
│ Permisos: Operación ❌ | Consulta ✅           │
└────────────────────────────────────────────────┘
```

**Query para validar:**
```sql
SELECT COUNT(*) as TotalMenus
FROM MenuRoles
WHERE idRol = (SELECT id FROM [Roles] WHERE name = 'USER')
AND estado = 1;

-- Esperado: 1
```

---

## 🔄 FLUJO DE ACCESO

### Escenario 1: Usuario con Rol SUPERADMIN ingresa

```
┌─────────────────┐
│  Usuario Login  │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────────────┐
│ AuthService valida credenciales             │
│ → Obtiene: idUser, idRol = 'SUPERADMIN'    │
└───────────────┬─────────────────────────────┘
                │
                ↓
┌────────────────────────────────────────────────┐
│ MenuService.getDataAllByRol('SUPERADMIN')     │
└────────────────┬───────────────────────────────┘
                 │
                 ↓ (Consulta BD)
        ┌────────────────────┐
        │ SELECT * FROM      │
        │ MenuRoles mr       │
        │ WHERE idRol='SUPER'│
        │ AND estado=1       │
        └────────────┬───────┘
                     │
         ┌───────────┴───────────┬──────────────┐
         ↓                       ↓              ↓
    [Menú 1]            [Menú 2]          [Menú N]
    /pages/entidad      /pages/usuario    ...
    
         │
         ↓
┌──────────────────────────────┐
│ Renderizar navbar con menús  │
│ - Link 1: /pages/entidad     │
│ - Link 2: /pages/usuario     │
│ ...                          │
└──────────────────────────────┘
         │
         ↓
    Usuario hace click en menú
         │
         ↓
┌───────────────────────────────┐
│ Router.navigate([ruta])       │
│ Ej: navigate(['/pages/entidad'])
└───────────────────────────────┘
```

---

### Escenario 2: Ruta ingresa pero menú no existe

```
┌──────────────────────────────────┐
│  Usuario intenta acceder a       │
│  /pages/aplicacion               │
│  (quizás conoce la URL)          │
└───────────┬──────────────────────┘
            │
            ↓
┌──────────────────────────────────┐
│ Angular Router resuelve ruta     │
│ ✅ /pages/aplicacion existe      │
└───────────┬──────────────────────┘
            │
            ✅ Permite acceso
            
            PERO
            
    ⚠️ No aparece en navbar
       porque el menú no tiene 
       permiso su rol en MenuRoles
```

---

## 🔐 MATRIZ DE PERMISOS (CRUD)

### Desglose por Operación

```
                        SUPERADMIN    ADMIN    USER
┌──────────────────────────────────────────────────┐
│ /pages/persona                                   │
│   Create (agregar):      ✅         ✅          ❌
│   Read (ver):            ✅         ✅          ✅
│   Update (editar):       ✅         ✅          ❌
│   Delete (eliminar):     ✅         ✅          ❌
└──────────────────────────────────────────────────┘

│ /pages/tipo-documento                            │
│   Create:                ✅         ❌          ❌
│   Read:                  ✅         ✅          ❓
│   Update:                ✅         ❌          ❌
│   Delete:                ✅         ❌          ❌
└──────────────────────────────────────────────────┘

│ /pages/rol                                       │
│   Create:                ✅         ❌          ❌
│   Read:                  ✅         ❌          ❌
│   Update:                ✅         ❌          ❌
│   Delete:                ✅         ❌          ❌
└──────────────────────────────────────────────────┘

│ /pages/user                                      │
│   Create:                ✅         ✅          ❌
│   Read:                  ✅         ✅          ❌
│   Update:                ✅         ✅          ❌
│   Delete:                ✅         ✅          ❌
└──────────────────────────────────────────────────┘
```

Los permisos están guardados en `MenuRoles`:
- `operacion` = Permite C-R-**U**-D
- `consulta` = Permite **R** (solo lectura)

---

## 🎯 PUNTOS DE VERIFICACIÓN CRÍTICOS

### Verificación 1: Ruta vs Componente

```
FOR EACH Ruta IN app.routes.ts:
    1. ¿Existe componenteMapeado?
    2. ¿Existe Menu en BD?
    3. ¿Menu tiene MenuRol para cada rol?
    4. ¿MenuRol.estado = 1?
```

### Verificación 2: Permisos

```
FOR EACH (Usuario, Rol) IN Sistema:
    1. GET MenuRoles WHERE idRol = rol
    2. FOREACH MenuRol:
        - ¿Usuario tiene este rol?
        - ¿MenuRol.estado = 1?
        - ¿Usuario tiene los permisos (operacion/consulta)?
    3. Renderizar solo menús disponibles
```

### Verificación 3: Navegación

```
WHEN Usuario hace click en Menú:
    1. Router.navigate([menu.ruta])
    2. ¿Ruta existe en app.routes.ts?
    3. ¿AuthGuard permite acceso?
    4. ¿Componente carga?
```

---

## 📊 CHECKLIST DE INTEGRIDAD

```sql
-- Verificar integridad referencial
SELECT 'Menu sin MenuRoles' as Problema
FROM Menus m
WHERE NOT EXISTS (SELECT 1 FROM MenuRoles WHERE idMenu = m.id)

UNION ALL

SELECT 'MenuRoles sin Menu'
FROM MenuRoles mr
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE id = mr.idMenu)

UNION ALL

SELECT 'MenuRoles sin Rol'
FROM MenuRoles mr
WHERE NOT EXISTS (SELECT 1 FROM [Roles] WHERE id = mr.idRol)

UNION ALL

SELECT 'Ruta en Menú pero no en Routes'
FROM Menus m
WHERE m.ruta NOT IN (
    '/pages/persona', '/pages/tipo-documento', '/pages/menu', '/pages/rol',
    '/pages/user', '/pages/entidad', '/pages/aplicacion', '/pages/unidadOrganica'
);
```

---

## 🚀 ESTADO ACTUAL

**Generado el:** 2026-02-11

Reemplaza `?` con tus valores reales de BD:

- [ ] Conexión a BD: _______________
- [ ] SUPERADMIN menús: `?` (Esperado: 8)
- [ ] ADMIN menús: `?` (Esperado: 4)
- [ ] USER menús: `?` (Esperado: 1)
- [ ] Rutas huérfanas encontradas: `?` (Esperado: 0)
- [ ] MenuRoles sin rol asignado: `?` (Esperado: 0)
- [ ] Ruta sin formato correcto: `?` (Esperado: 0)

---

**Status:** 🟡 PENDIENTE VALIDACIÓN EN BD
