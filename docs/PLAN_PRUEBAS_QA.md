# PLAN DE PRUEBAS MANUALES - SISTEMA CAD

## Información del Documento

| Campo | Valor |
|-------|-------|
| **Proyecto** | Sistema CAD - Computer Aided Dispatch |
| **Versión** | 1.0.0 |
| **Fecha** | 2025-11-23 |
| **Autor** | Equipo de Desarrollo |
| **Estado** | Listo para Pruebas |

---

## 1. INTRODUCCIÓN

### 1.1 Propósito
Este documento define los casos de prueba manuales que el equipo de QA debe ejecutar para validar el correcto funcionamiento del Sistema CAD.

### 1.2 Alcance
- Módulo de Autenticación
- Gestión de Usuarios (CRUD)
- Catálogos del Sistema (8 catálogos)
- Formularios de Involucrados (7 formularios)

### 1.3 Prerequisitos
- Acceso a la aplicación en http://localhost:3000
- API Backend en http://localhost:4000
- Base de datos inicializada con seed

### 1.4 Credenciales de Prueba

| Usuario | Contraseña | Perfil |
|---------|------------|--------|
| ADMIN | Admin123 | Administrador |
| SUP_001 | Admin123 | Supervisor |
| OP_001 | Admin123 | Operador |
| DESP_001 | Admin123 | Despachador |

---

## 2. CASOS DE PRUEBA - AUTENTICACIÓN

### CP-AUTH-001: Login Exitoso - Administrador
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Precondiciones** | Usuario ADMIN existe y está activo |

**Pasos:**
1. Abrir http://localhost:3000/login
2. Ingresar usuario: `ADMIN`
3. Ingresar contraseña: `Admin123`
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- [ ] Redirección al dashboard
- [ ] Muestra nombre "Administrador" en la barra
- [ ] Menú de administración visible

---

### CP-AUTH-002: Login Exitoso - Operador
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Precondiciones** | Usuario OP_001 existe y está activo |

**Pasos:**
1. Abrir http://localhost:3000/login
2. Ingresar usuario: `OP_001`
3. Ingresar contraseña: `Admin123`
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- [ ] Redirección al dashboard de operador
- [ ] No muestra menú de administración
- [ ] Módulo de llamadas visible

---

### CP-AUTH-003: Login Fallido - Usuario No Existe
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Seguridad |

**Pasos:**
1. Abrir http://localhost:3000/login
2. Ingresar usuario: `NOEXISTE`
3. Ingresar contraseña: `cualquier`
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- [ ] Muestra mensaje "Usuario no registrado en el sistema"
- [ ] Permanece en página de login
- [ ] No almacena token en localStorage

---

### CP-AUTH-004: Login Fallido - Contraseña Incorrecta
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Seguridad |

**Pasos:**
1. Abrir http://localhost:3000/login
2. Ingresar usuario: `ADMIN`
3. Ingresar contraseña: `incorrecta`
4. Click en "Iniciar Sesión"

**Resultado Esperado:**
- [ ] Muestra mensaje "Contraseña incorrecta"
- [ ] Contador de intentos incrementa
- [ ] Permanece en página de login

---

### CP-AUTH-005: Bloqueo por Intentos Fallidos
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Seguridad |
| **Precondiciones** | Usuario no bloqueado |

**Pasos:**
1. Intentar login 3 veces con contraseña incorrecta

**Resultado Esperado:**
- [ ] Al tercer intento muestra "Usuario bloqueado"
- [ ] Usuario no puede iniciar sesión
- [ ] Requiere desbloqueo por administrador

---

### CP-AUTH-006: Cerrar Sesión
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Precondiciones** | Sesión iniciada |

**Pasos:**
1. Click en menú de usuario
2. Click en "Cerrar Sesión"

**Resultado Esperado:**
- [ ] Redirección a login
- [ ] Token eliminado de localStorage
- [ ] No puede acceder a rutas protegidas

---

## 3. CASOS DE PRUEBA - GESTIÓN DE USUARIOS

### CP-USR-001: Visualizar Lista de Usuarios
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Precondiciones** | Login como Administrador |

**Pasos:**
1. Navegar a Administración > Usuarios

**Resultado Esperado:**
- [ ] Tabla con usuarios existentes
- [ ] Columnas: Usuario, Nombre, Perfil, Estado, Acciones
- [ ] Mínimo 4 usuarios visibles (seed)

---

### CP-USR-002: Filtrar Usuarios por Búsqueda
| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Tipo** | Funcional |

**Pasos:**
1. Escribir "ADMIN" en campo de búsqueda
2. Esperar filtrado

**Resultado Esperado:**
- [ ] Solo muestra usuario ADMIN
- [ ] Filtro en tiempo real

---

### CP-USR-003: Filtrar por Perfil
| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Tipo** | Funcional |

**Pasos:**
1. Seleccionar "Operador" en filtro de perfil

**Resultado Esperado:**
- [ ] Solo muestra usuarios con perfil Operador
- [ ] Chip de perfil correcto en cada fila

---

### CP-USR-004: Crear Nuevo Usuario
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Pasos:**
1. Click en "Nuevo Usuario"
2. Llenar campos:
   - Nombre de Usuario: `TEST_QA_001`
   - Contraseña: `Test123456`
   - Nombre: `Usuario`
   - Apellido Paterno: `QA`
   - Perfil: Operador
3. Click en "Crear"

**Resultado Esperado:**
- [ ] Modal se cierra
- [ ] Mensaje "Usuario creado exitosamente"
- [ ] Usuario aparece en la tabla

---

### CP-USR-005: Validación de Campos Requeridos
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Validación |

**Pasos:**
1. Click en "Nuevo Usuario"
2. Click en "Crear" sin llenar campos

**Resultado Esperado:**
- [ ] Muestra errores en campos requeridos
- [ ] No crea el usuario
- [ ] Campos requeridos resaltados en rojo

---

### CP-USR-006: No Permitir Usuario Duplicado
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Validación |

**Pasos:**
1. Intentar crear usuario con nombreUsuario: `ADMIN`

**Resultado Esperado:**
- [ ] Mensaje "El nombre de usuario ya existe"
- [ ] No crea el usuario

---

### CP-USR-007: Editar Usuario
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Pasos:**
1. Click en icono de editar en usuario OP_001
2. Modificar nombre a "Operador Modificado"
3. Click en "Actualizar"

**Resultado Esperado:**
- [ ] Modal se cierra
- [ ] Mensaje "Usuario actualizado exitosamente"
- [ ] Cambios reflejados en la tabla

---

### CP-USR-008: Resetear Contraseña
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Pasos:**
1. Click en icono de llave en un usuario
2. Ingresar nueva contraseña: `NuevaPass123`

**Resultado Esperado:**
- [ ] Mensaje "Contraseña reseteada exitosamente"
- [ ] Usuario puede login con nueva contraseña

---

### CP-USR-009: Desbloquear Usuario
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Precondiciones** | Usuario bloqueado |

**Pasos:**
1. Identificar usuario bloqueado (Chip "BLOQUEADO")
2. Click en icono de desbloquear

**Resultado Esperado:**
- [ ] Mensaje "Usuario desbloqueado exitosamente"
- [ ] Estado cambia a "ACTIVO"

---

### CP-USR-010: Activar/Desactivar Usuario
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Pasos:**
1. Click en icono de candado en usuario activo

**Resultado Esperado:**
- [ ] Estado cambia de ACTIVO a INACTIVO
- [ ] Mensaje de confirmación

---

## 4. CASOS DE PRUEBA - CATÁLOGOS

### CP-CAT-001: CRUD Municipios
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Ruta** | /admin/municipios |

**Verificar:**
- [ ] Listar municipios (Toluca, Metepec, Lerma, Zinacantepec)
- [ ] Crear nuevo municipio
- [ ] Editar municipio existente
- [ ] Eliminar municipio (sin colonias)

---

### CP-CAT-002: CRUD Colonias
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Ruta** | /admin/colonias |

**Verificar:**
- [ ] Listar colonias
- [ ] Filtrar por municipio
- [ ] Crear nueva colonia con código postal
- [ ] Editar colonia
- [ ] Eliminar colonia

---

### CP-CAT-003: CRUD Calles
| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Tipo** | Funcional |
| **Ruta** | /admin/calles |

**Verificar:**
- [ ] Listar calles (Hidalgo, Juárez, Independencia, Morelos)
- [ ] Buscar por nombre
- [ ] Crear nueva calle
- [ ] Asociar a municipio

---

### CP-CAT-004: CRUD Corporaciones
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Ruta** | /admin/corporaciones |

**Verificar:**
- [ ] Listar corporaciones (PM, PE, CR, BOM, PC)
- [ ] Ver contador de unidades
- [ ] Crear nueva corporación
- [ ] No eliminar si tiene unidades

---

### CP-CAT-005: CRUD Unidades
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Ruta** | /admin/unidades |

**Verificar:**
- [ ] Listar unidades (PM-001 a PM-010)
- [ ] Filtrar por corporación
- [ ] Filtrar por estatus
- [ ] Crear nueva unidad
- [ ] Campos: número económico, placas, sector

---

### CP-CAT-006: CRUD Tipos de Incidente
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Ruta** | /admin/tipos-incidente |

**Verificar:**
- [ ] Listar tipos (SEG, MED, PC)
- [ ] Ver estructura jerárquica
- [ ] Crear nuevo tipo con prioridad
- [ ] Configurar tiempo de respuesta esperado

---

### CP-CAT-007: CRUD Perfiles
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |
| **Ruta** | /admin/perfiles |

**Verificar:**
- [ ] 4 perfiles existentes
- [ ] Ver usuarios por perfil
- [ ] No eliminar perfil con usuarios asignados

---

## 5. CASOS DE PRUEBA - FORMULARIOS DE INVOLUCRADOS

### CP-INV-001: Formulario de Persona
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Nombre, Apellidos
- [ ] Género, Fecha de nacimiento
- [ ] CURP, RFC
- [ ] Descripción física
- [ ] Señas particulares

---

### CP-INV-002: Formulario de Vehículo
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Marca, Modelo, Año
- [ ] Color, Placas
- [ ] Número de serie
- [ ] Estado del vehículo

---

### CP-INV-003: Formulario de Inmueble
| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Tipo de inmueble
- [ ] Dirección completa
- [ ] Características físicas
- [ ] Propietario

---

### CP-INV-004: Formulario de Teléfono
| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Número de teléfono
- [ ] Tipo (celular, fijo, etc.)
- [ ] Compañía
- [ ] IMEI (si aplica)

---

### CP-INV-005: Formulario de Arma
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Tipo (fuego, blanca, contundente)
- [ ] Marca, calibre, modelo
- [ ] Número de serie
- [ ] Documentación

---

### CP-INV-006: Formulario de Sustancia
| Campo | Valor |
|-------|-------|
| **Prioridad** | Alta |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Tipo de sustancia
- [ ] Presentación, empaque
- [ ] Cantidad, unidad de medida
- [ ] Cadena de custodia

---

### CP-INV-007: Formulario de Documento
| Campo | Valor |
|-------|-------|
| **Prioridad** | Media |
| **Tipo** | Funcional |

**Campos a Verificar:**
- [ ] Tipo de documento
- [ ] Número/Folio
- [ ] Titular
- [ ] Fechas de expedición/vigencia

---

## 6. PRUEBAS DE SEGURIDAD

### CP-SEG-001: Acceso sin Autenticación
**Verificar:**
- [ ] /admin/usuarios redirige a login
- [ ] /dashboard redirige a login
- [ ] API retorna 401 sin token

---

### CP-SEG-002: Permisos por Perfil
**Verificar:**
- [ ] Operador NO puede crear usuarios
- [ ] Operador NO puede acceder a catálogos
- [ ] Solo Administrador modifica catálogos

---

### CP-SEG-003: XSS Prevention
**Verificar:**
- [ ] Ingresar `<script>alert('XSS')</script>` en campos
- [ ] No debe ejecutar scripts
- [ ] Debe escapar caracteres

---

### CP-SEG-004: SQL Injection Prevention
**Verificar:**
- [ ] Ingresar `'; DROP TABLE usuarios;--` en búsqueda
- [ ] No debe afectar base de datos
- [ ] Consulta parametrizada

---

## 7. PRUEBAS DE RENDIMIENTO

### CP-PERF-001: Tiempo de Carga
**Métricas:**
- [ ] Login < 2 segundos
- [ ] Listado de usuarios < 3 segundos
- [ ] Creación de usuario < 2 segundos

---

### CP-PERF-002: Carga de Datos
**Verificar:**
- [ ] Tabla con 100+ registros carga correctamente
- [ ] Paginación funciona correctamente
- [ ] Filtros responden en < 1 segundo

---

## 8. MATRIZ DE TRAZABILIDAD

| Módulo | Casos | Alta | Media | Baja |
|--------|-------|------|-------|------|
| Autenticación | 6 | 5 | 1 | 0 |
| Usuarios | 10 | 7 | 3 | 0 |
| Catálogos | 7 | 5 | 2 | 0 |
| Involucrados | 7 | 4 | 3 | 0 |
| Seguridad | 4 | 4 | 0 | 0 |
| Rendimiento | 2 | 1 | 1 | 0 |
| **TOTAL** | **36** | **26** | **10** | **0** |

---

## 9. EJECUCIÓN DE PRUEBAS AUTOMATIZADAS

### Prerequisitos
```bash
cd frontend
npm install
```

### Ejecutar todas las pruebas
```bash
npm run cypress:run
```

### Ejecutar con interfaz visual
```bash
npm run cypress:open
```

### Generar reporte HTML
```bash
npm run cypress:run:report
```

Los reportes se generan en `frontend/cypress/reports/`

---

## 10. REGISTRO DE DEFECTOS

| ID | Descripción | Severidad | Estado | Fecha |
|----|-------------|-----------|--------|-------|
| DEF-001 | Campo incorrecto accesoTelefoniaHabilitado | Alta | Corregido | 2025-11-23 |
| DEF-002 | Campo incorrecto ultimoLogin | Alta | Corregido | 2025-11-23 |
| DEF-003 | Icono LockOpen no importado | Media | Corregido | 2025-11-23 |

---

## 11. APROBACIÓN

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Desarrollador | | | |
| QA Lead | | | |
| Project Manager | | | |

---

*Documento generado automáticamente como parte del proceso de pruebas del Sistema CAD*
