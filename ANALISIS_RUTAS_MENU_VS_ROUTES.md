# Análisis: Comparación de Rutas de Menús por Rol vs Routes de Angular

## 📋 Resumen Ejecutivo

Este documento compara las rutas definidas en el sistema de enrutamiento de Angular con las rutas almacenadas en los menús asociados a cada rol. Identifica inconsistencias y proporciona recomendaciones.

---

## 1. RUTAS DEFINIDAS EN EL SISTEMA ANGULAR

### 1.1 Rutas Públicas (`app.routes.ts`)
| ID | Ruta | Componente | Protegida | Estado |
|-----|------|-----------|----------|--------|
| 1 | `/login` | LoginComponent | ❌ No | ✅ Activa |
| 2 | `/register` | RegisterComponent | ❌ No | ✅ Activa |
| 3 | `/forgot-password` | ForgotPasswordComponent | ❌ No | ✅ Activa |
| 4 | `/reset-password` | ResetPasswordComponent | ❌ No | ✅ Activa |
| 5 | `/change-password` | ChangePasswordComponent | ❌ No | ✅ Activa |

### 1.2 Rutas Protegidas - Nivel Principal (`app.routes.ts`)
| ID | Ruta | Componente | Protegida | Estado |
|-----|------|-----------|----------|--------|
| 6 | `/pages/persona` | PersonaComponent | ✅ Sí (guardiam: authGuard) | ✅ Activa |
| 7 | `/pages/tipo-documento` | TipoDocumentoComponent | ❌ No | ✅ Activa |
| 8 | `/pages/menu` | MenuComponent | ❌ No | ✅ Activa |
| 9 | `/pages/rol` | RolComponent | ❌ No | ✅ Activa |

### 1.3 Rutas Protegidas - Nivel Child (`pages.routes.ts`)
| ID | Ruta | Componente | Estado |
|-----|------|-----------|--------|
| 10 | `/pages/user` | UserComponent | ✅ Activa |
| 11 | `/pages/user/unidadorganica-user/:userId` | UnidadorganicaUserComponent | ✅ Activa |
| 12 | `/pages/entidad` | EntidadComponent | ✅ Activa |
| 13 | `/pages/aplicacion` | AplicacionComponent | ✅ Activa |
| 14 | `/pages/unidadOrganica` | UnidadorganicaComponent | ✅ Activa |

---

## 2. ESTRUCTURA DE MENÚS EN LA BASE DE DATOS

### 2.1 Interfaces de Menú (Modelos)

#### MenuInfo (para obtención de menús)
```typescript
{
  id: number;
  descripcion: string;
  icono: string;
  ruta: string;              // ← Campo clave de ruta
  idAplicacion: number;
  idMenuPadre: number | null; // Para menús jerárquicos
}
```

#### MenuRol (para asignación por rol)
```typescript
{
  id: number;
  descripcion: string;
  icono: string;
  ruta: string;              // ← Campo clave de ruta
  idAplicacion: number;
  idRol: string;
  idMenuPadre: number | null;
}
```

### 2.2 Servicios Relacionados

#### MenuService
```typescript
- GetByAplicationAsync(idAplicacion)
- GetByAplicationAsyncSingle(idAplicacion)
- getDataAllByRol(idRol)
- getDataWithRol()
- SaveWithRol(menu)
```

#### MenurolService
```typescript
- getData(idEntidad, idAplicacion, idRol)
- update(id, menuRol)
- save(menuRol)
```

---

## 3. ANÁLISIS DE CONSISTENCIA

### 3.1 Rutas que SÍ Deberían Estar en Menús

Estas rutas son públicas o protegidas y son accesibles desde la navegación principal:

✅ **Rutas con potencial de estar en menús:**

| Ruta | Descripción | Debería estar en menú |
|------|------------|-----------------------|
| `/pages/persona` | Gestión de Personas | ✅ **SÍ** - es un CRUD principal |
| `/pages/tipo-documento` | Tipos de Documento | ✅ **SÍ** - es un catálogo |
| `/pages/menu` | Gestión de Menús | ✅ **SÍ** - Solo para administradores |
| `/pages/rol` | Gestión de Roles | ✅ **SÍ** - Solo para administradores |
| `/pages/user` | Gestión de Usuarios | ✅ **SÍ** - Gestión de acceso |
| `/pages/entidad` | Entidades | ✅ **SÍ** - Catálogo principal |
| `/pages/aplicacion` | Aplicaciones | ✅ **SÍ** - Gestión de apps |
| `/pages/unidadOrganica` | Unidades Orgánicas | ✅ **SÍ** - Estructura organizacional |

### 3.2 Rutas que NO Deberían Estar en Menús

| Ruta | Razón |
|------|-------|
| `/login` | Acceso antes de autenticación |
| `/register` | Acceso público |
| `/forgot-password` | Acceso público |
| `/reset-password` | Acceso público |
| `/change-password` | Acceso después de login (modal/dialog) |
| `/pages/user/unidadorganica-user/:id` | Subruta de contexto, no menú principal |

---

## 4. PROBLEMAS IDENTIFICADOS

### ⚠️ Problema 1: Inconsistencia en Prefijos de Ruta
**Severidad:** 🔴 ALTA

Los menús podrían almacenar rutas de dos formas:
- **Opción A:** `pages/persona` (sin `/`)
- **Opción B:** `/pages/persona` (con `/`)

**Impacto:** Las navegaciones fallaran si no coinciden.

```typescript
// En header.component.ts se usa:
route: nav.ruta,  // Esperando que sea correcto

// El routerLink espera:
<a routerLink="{{ route }}">  // Necesita formato correcto
```

**Recomendación:**
- Estandarizar todas las rutas a: **`/pages/[componente]`**
- Validar en la API que no haya rutas duplicadas o malformadas

### ⚠️ Problema 2: Rutas No Documentadas en Menús
**Severidad:** 🟠 MEDIA

No se encontró definición de en qué menús deberían aparecer:
- `/pages/tipo-documento`
- `/pages/aplicacion`
- `/pages/entidad`

**Impacto:** Usuarios sin acceso a funcionalidades aunque la ruta exista.

### ⚠️ Problema 3: Desincronización Principal vs Child Routes
**Severidad:** 🟠 MEDIA

La ruta `/pages` carga `pages.routes` con rutas child, pero también hay rutas child directo en `app.routes.ts`:

```typescript
// app.routes.ts
{
  path: 'pages/persona',  // ← Directo, no en children
  ...
}

// pages.routes.ts
{
  path: 'pages/user',     // ← En children de /pages
  ...
}
```

**Impacto:** Inconsistencia en cómo se definen y navegan las rutas.

### ⚠️ Problema 4: Ausencia de authGuard en Rutas
**Severidad:** 🟡 BAJA

Solo `/pages/persona` tiene `authGuard`, mientras que otras rutas protegidas no:

```typescript
// Solo esta tiene authGuard:
{
  path: 'pages/persona',
  canActivate: [authGuard],  // ← Solo aquí
  ...
}

// Estas deberían tenerlo:
{
  path: 'pages/rol',
  // canActivate: [authGuard],  // ← Comentado
  ...
}
```

**Recomendación:** Aplicar `authGuard` a todas las rutas protegidas.

---

## 5. VERIFICACIÓN DE RUTAS EN BASE DE DATOS

### 5.1 Consultas Recomendadas para Validar

```sql
-- Verificar rutas de menús únicos
SELECT DISTINCT ruta, COUNT(*) as cantidad
FROM Menus
GROUP BY ruta
ORDER BY cantidad DESC;

-- Verificar menús por rol
SELECT r.id, r.name, COUNT(mr.id) as cantidad_menus
FROM Roles r
LEFT JOIN MenuRoles mr ON r.id = mr.idRol
GROUP BY r.id, r.name;

-- Verificar rutas inconsistentes
SELECT *
FROM Menus
WHERE ruta NOT LIKE '/pages/%'
  AND ruta NOT IN ('/login', '/register', '/forgot-password', '/reset-password', '/change-password')
ORDER BY ruta;

-- Detectar rutas que no existen en routes
SELECT m.id, m.descripcion, m.ruta
FROM Menus m
WHERE m.ruta NOT IN (
  '/login', '/register', '/forgot-password', '/reset-password', '/change-password',
  '/pages/persona', '/pages/tipo-documento', '/pages/menu', '/pages/rol',
  '/pages/user', '/pages/entidad', '/pages/aplicacion', '/pages/unidadOrganica'
)
ORDER BY m.ruta;
```

---

## 6. MAPEO RECOMENDADO DE MENÚS POR ROL

### 6.1 Roles Típicos y Sus Menús

#### Role: SUPERADMIN
```json
{
  "menusPorRol": [
    { "ruta": "/pages/entidad", "descripcion": "Entidades" },
    { "ruta": "/pages/aplicacion", "descripcion": "Aplicaciones" },
    { "ruta": "/pages/rol", "descripcion": "Roles" },
    { "ruta": "/pages/menu", "descripcion": "Menús" },
    { "ruta": "/pages/user", "descripcion": "Usuarios" },
    { "ruta": "/pages/unidadOrganica", "descripcion": "Unidades Orgánicas" }
  ]
}
```

#### Role: ADMIN_ENTITY
```json
{
  "menusPorRol": [
    { "ruta": "/pages/persona", "descripcion": "Personas" },
    { "ruta": "/pages/user", "descripcion": "Usuarios" },
    { "ruta": "/pages/unidadOrganica", "descripcion": "Unidades Orgánicas" },
    { "ruta": "/pages/tipo-documento", "descripcion": "Tipos de Documento" }
  ]
}
```

#### Role: USER
```json
{
  "menusPorRol": [
    { "ruta": "/pages/persona", "descripcion": "Personas" }
  ]
}
```

---

## 7. COMPONENTES DE VERIFICACIÓN EN FRONTEND

### 7.1 Lugares Donde se Consumen las Rutas de Menú

```typescript
// 1. app.component.ts - Línea ~120
this.menuService.GetByAplicationAsync(idAplicacion).subscribe((data: any[]) => {
  data.forEach((nav) => {
    const navItem: NavItem = {
      route: nav.ruta,  // ← Aquí se usa
      ...
    };
  });
});

// 2. header.component.ts - Línea ~195
this.menuService.GetByAplicationAsync(appRol.id).subscribe({
  next: (data: any[]) => {
    data.forEach((nav) => {
      const navItem: NavItem = {
        route: nav.ruta,  // ← Aquí se usa
        ...
      };
    });
  }
});

// 3. dialog-menu.component.ts - Línea ~81
// Carga menús por rol con estado
this.menusrolservice.getData(
  idEntidad, 
  idAplicacion, 
  idRol
).subscribe(...);
```

---

## 8. CHECKLIST DE VALIDACIÓN

Para asegurar que las rutas de menús coinciden con las rutas del sistema:

- [ ] **Verificar en BD:** Todas las rutas en tabla `Menus` coinciden con rutas en `app.routes.ts` o `pages.routes.ts`
- [ ] **Validar formato:** Todas las rutas comienzan con `/` (ej: `/pages/persona`)
- [ ] **Revisar permisos:** Cada menú tiene el rol correcto asignado
- [ ] **Probar navegación:** Hacer clic en cada menú navega correctamente
- [ ] **Verificar guardias:** Aplicar `authGuard` consistentemente a todas las rutas protegidas
- [ ] **Prueba de roles:** Para cada rol, verificar que solo ve sus menús asignados
- [ ] **Menús jerárquicos:** Si hay menús padre/hijo, verificar que `idMenuPadre` es correcto
- [ ] **Rutas huérfanas:** Identificar rutas en sistema que no tienen menú

---

## 9. SIGUIENTES PASOS RECOMENDADOS

### Fase 1: Auditoría (THIS WEEK)
1. **Ejecutar consultas SQL** del punto 5.1 para ver estado actual
2. **Generar reporte** de discrepancias
3. **Documentar roles actuales** y sus menús asignados

### Fase 2: Correcciones (NEXT WEEK)
1. **Estandarizar rutas** en BD (con `/` al inicio)
2. **Actualizar routes** en Angular para consistencia
3. **Agregar authGuard** donde falte
4. **Crear script de migración** si es necesario

### Fase 3: Testing (WEEK AFTER)
1. **Pruebas E2E** por cada rol
2. **Validar navegación** desde menús
3. **Performance test** con muchos menús

---

## 10. REFERENCIAS EN CÓDIGO

### Archivos Clave:
- [app.routes.ts](src/app/app.routes.ts#L1) - Definición de rutas principales
- [pages.routes.ts](src/app/pages/pages.routes.ts#L1) - Rutas de páginas
- [MenuService](src/app/service/menu.service.ts#L37) - Obtención de menús
- [MenurolService](src/app/service/menurol.service.ts#L20) - Menús por rol
- [app.component.ts](src/app/app.component.ts#L120) - Consumo de menús
- [header.component.ts](src/app/layouts/full/vertical/header/header.component.ts#L195) - Switch de rol

### Modelos:
- [Menu Interface](src/app/model/menu.ts#L3) - Estructura base
- [MenuRol Interface](src/app/model/menu.ts#L23) - Con rol
- [MenuInfo Interface](src/app/model/menu.ts#L30) - Información completa

---

**Última actualización:** 2026-02-11  
**Estado:** ⚠️ REQUIERE REVISIÓN EN BASE DE DATOS
