# 🔍 VALIDADOR INTERACTIVO DE RUTAS

## Instrucciones de Uso

Este documento contiene checklists y validadores para verificar que tus menús en BD coincidan con las rutas del sistema.

---

## ✅ VALIDADOR POR COMPONENTE

### 1️⃣ PÁGINAS PRINCIPALES (app.routes.ts)

Verifica que exista en tabla `Menus`:

| Ruta | Componente | ID BD | ¿Existe? | ¿Menú? | Roles | ✅/❌ |
|------|-----------|-------|----------|--------|-------|-------|
| `/pages/persona` | PersonaComponent | ? | ☐ | ☐ | ADMIN, USER | |
| `/pages/tipo-documento` | TipoDocumentoComponent | ? | ☐ | ☐ | ADMIN | |
| `/pages/menu` | MenuComponent | ? | ☐ | ☐ | SUPERADMIN | |
| `/pages/rol` | RolComponent | ? | ☐ | ☐ | SUPERADMIN | |

**Instrucciones:** Ejecuta esta query:
```sql
SELECT id, descripcion, ruta, idAplicacion
FROM Menus
WHERE ruta IN ('/pages/persona', '/pages/tipo-documento', '/pages/menu', '/pages/rol')
ORDER BY ruta;
```

### 2️⃣ PÁGINAS CHILD (pages.routes.ts)

| Ruta | Componente | ID BD | ¿Existe? | ¿Menú? | Roles | ✅/❌ |
|------|-----------|-------|----------|--------|-------|-------|
| `/pages/user` | UserComponent | ? | ☐ | ☐ | ADMIN | |
| `/pages/entidad` | EntidadComponent | ? | ☐ | ☐ | SUPERADMIN | |
| `/pages/aplicacion` | AplicacionComponent | ? | ☐ | ☐ | SUPERADMIN | |
| `/pages/unidadOrganica` | UnidadorganicaComponent | ? | ☐ | ☐ | ADMIN | |

**Instrucciones:** Ejecuta esta query:
```sql
SELECT id, descripcion, ruta, idAplicacion
FROM Menus
WHERE ruta IN ('/pages/user', '/pages/entidad', '/pages/aplicacion', '/pages/unidadOrganica')
ORDER BY ruta;
```

### 3️⃣ PÁGINAS DE AUTENTICACIÓN (app.routes.ts)

⚠️ **NOTA:** Normalmente NO deberían estar en menús

| Ruta | ¿Debe estar en menú? | Motivo |
|------|----------------------|--------|
| `/login` | ❌ NO | Acceso público |
| `/register` | ❌ NO | Acceso público |
| `/forgot-password` | ❌ NO | Acceso público |
| `/reset-password` | ❌ NO | Acceso público |
| `/change-password` | ⚠️ QUIZÁS | Podría ser modal, no menú |

---

## 🔗 VALIDADOR DE MENÚS POR ROL

### Verificar por Rol

#### SUPERADMIN
```sql
SELECT mr.id, mr.descripcion, mr.ruta, mr.idRol
FROM MenuRoles mr
WHERE mr.idRol = '[ID_SUPERADMIN]'
AND mr.estado = 1
ORDER BY mr.ruta;
```

**Esperado:**
- ✅ `/pages/entidad`
- ✅ `/pages/aplicacion`
- ✅ `/pages/rol`
- ✅ `/pages/menu`
- ✅ `/pages/user`
- ✅ `/pages/unidadOrganica`

---

#### ADMIN_ENTITY
```sql
SELECT mr.id, mr.descripcion, mr.ruta, mr.idRol
FROM MenuRoles mr
WHERE mr.idRol = '[ID_ADMIN]'
AND mr.estado = 1
ORDER BY mr.ruta;
```

**Esperado:**
- ✅ `/pages/persona`
- ✅ `/pages/user`
- ✅ `/pages/unidadOrganica`
- ✅ `/pages/tipo-documento`

---

#### USER
```sql
SELECT mr.id, mr.descripcion, mr.ruta, mr.idRol
FROM MenuRoles mr
WHERE mr.idRol = '[ID_USER]'
AND mr.estado = 1
ORDER BY mr.ruta;
```

**Esperado:**
- ✅ `/pages/persona`

---

## 🚨 DETECTAR PROBLEMAS

### A. RUTAS EN BD QUE NO EXISTEN EN ANGULAR

```sql
-- Encuentra rutas huérfanas
SELECT DISTINCT m.id, m.descripcion, m.ruta
FROM Menus m
WHERE m.ruta NOT IN (
    '/pages/persona',
    '/pages/tipo-documento',
    '/pages/menu',
    '/pages/rol',
    '/pages/user',
    '/pages/entidad',
    '/pages/aplicacion',
    '/pages/unidadOrganica',
    '/pages/user/unidadorganica-user/:userId'
)
AND m.ruta NOT LIKE '/login%'
AND m.ruta NOT LIKE '/register%'
AND m.ruta NOT LIKE '/forgot%'
AND m.ruta NOT LIKE '/reset%'
AND m.ruta NOT LIKE '/change%'
ORDER BY m.ruta;
```

**✔️ Si retorna 0 filas:** Todas las rutas son válidas
**⚠️ Si retorna filas:** Hay rutas que no se pueden navegar

---

### B. RUTAS EN ANGULAR QUE NO TIENEN MENÚ

```sql
-- Encuentra rutas sin acceso
SELECT 'Sistema' as Fuente, '/pages/persona' as Ruta
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/persona')

UNION ALL

SELECT 'Sistema', '/pages/tipo-documento'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/tipo-documento')

UNION ALL

SELECT 'Sistema', '/pages/menu'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/menu')

UNION ALL

SELECT 'Sistema', '/pages/rol'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/rol')

UNION ALL

SELECT 'Sistema', '/pages/user'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/user')

UNION ALL

SELECT 'Sistema', '/pages/entidad'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/entidad')

UNION ALL

SELECT 'Sistema', '/pages/aplicacion'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/aplicacion')

UNION ALL

SELECT 'Sistema', '/pages/unidadOrganica'
WHERE NOT EXISTS (SELECT 1 FROM Menus WHERE ruta = '/pages/unidadOrganica')

ORDER BY Ruta;
```

**✔️ Si retorna 0 filas:** Todas las rutas tienen menú
**⚠️ Si retorna filas:** Hay rutas sin menú (usuarios no pueden acceder)

---

### C. MENÚS SIN ROLES ASIGNADOS

```sql
-- Encuentra menús que no tienen ningún rol
SELECT m.id, m.descripcion, m.ruta
FROM Menus m
WHERE NOT EXISTS (
    SELECT 1 FROM MenuRoles mr WHERE mr.idMenu = m.id AND mr.estado = 1
)
ORDER BY m.ruta;
```

**✔️ Si retorna 0 filas:** Todos los menús tienen roles
**⚠️ Si retorna filas:** Hay menús sin rol (nadie puede verlos)

---

### D. RUTAS CON FORMATO INCORRECTO

```sql
-- Detecta rutas sin el prefijo /
SELECT id, descripcion, ruta
FROM Menus
WHERE ruta NOT LIKE '/%'
ORDER BY ruta;

-- Detecta rutas duplicadas
SELECT ruta, COUNT(*) as cantidad
FROM Menus
GROUP BY ruta
HAVING COUNT(*) > 1;

-- Detecta espacios en blanco
SELECT id, descripcion, '[' + ruta + ']' as ruta_visible
FROM Menus
WHERE ruta LIKE '% %' OR ruta LIKE ' %' OR ruta LIKE '% ';
```

---

## 📊 REPORTE GENERAL

### Generar Resumen de Inconsistencias

```sql
SELECT
    'TOTAL RUTAS EN SISTEMA' as Categoría,
    COUNT(*) as Cantidad
FROM (
    SELECT 1
    WHERE '/pages/persona' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/tipo-documento' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/menu' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/rol' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/user' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/entidad' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/aplicacion' IS NOT NULL
    UNION ALL SELECT 1 WHERE '/pages/unidadOrganica' IS NOT NULL
) as rutas

UNION ALL

SELECT 'RUTAS EN BD', COUNT(*) FROM Menus

UNION ALL

SELECT 'MENÚ-ROL MAPPINGS', COUNT(*) FROM MenuRoles WHERE estado = 1

UNION ALL

SELECT 'ROLES ACTIVOS', COUNT(*) FROM [Roles] WHERE estado = 1;
```

---

## 🛠️ SCRIPTS DE CORRECCIÓN

### A. Agregar Menú Faltante

```sql
-- Template para agregar un menú
INSERT INTO Menus (descripcion, icono, ruta, idAplicacion, idMenuPadre, estado)
VALUES 
    (N'Entidades', 'ico-building', '/pages/entidad', 1, NULL, 1);

-- Luego obtener el ID generado y asignar a rol:
INSERT INTO MenuRoles (idMenu, idRol, estado)
VALUES 
    ((SELECT TOP 1 id FROM Menus WHERE ruta = '/pages/entidad'), 'SUPERADMIN', 1);
```

### B. Corregir Formato de Ruta

```sql
-- Agregar / al inicio si no existe
UPDATE Menus
SET ruta = '/' + ruta
WHERE ruta NOT LIKE '/%';

-- Remover espacios
UPDATE Menus
SET ruta = TRIM(ruta);
```

### C. Desactivar Menús Huérfanos

```sql
-- Desactivar menús que apunten a rutas inexistentes
UPDATE MenuRoles
SET estado = 0
WHERE idMenu IN (
    SELECT id FROM Menus
    WHERE ruta NOT IN ('/pages/persona', '/pages/tipo-documento', '/pages/menu', '/pages/rol',
                       '/pages/user', '/pages/entidad', '/pages/aplicacion', '/pages/unidadOrganica')
);
```

---

## 🎯 RESUMEN DE VERIFICACIÓN

Marca cada item cuando lo verifiques:

- [ ] Conectar a BD y ejecutar queries A, B, C, D
- [ ] Documentar resultados de cada query
- [ ] Identificar discrepancias
- [ ] Crear tickets para cada problema encontrado
- [ ] Ejecutar scripts de corrección
- [ ] Re-ejecutar queries para validar correcciones
- [ ] Informar al equipo de cambios realizados
- [ ] Probar en ambiente de desarrollo
- [ ] Desplegar a producción

---

**Última actualización:** 2026-02-11
**Responsable:** Equipo de Base de Datos / Backend
