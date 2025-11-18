# Sistema CAD - Computer-Aided Dispatch

Sistema completo de despacho de emergencias (CAD) para centros de atención de llamadas de emergencia. Incluye módulos de recepción de llamadas, captura de incidentes, despacho de unidades, supervisión y administración.

## 📋 Características Principales

### Módulos del Sistema

1. **Autenticación y Acceso**
   - Login con usuario/contraseña
   - Perfiles diferenciados (Operador, Despachador, Supervisor, Administrador)
   - Integración con extensiones telefónicas
   - Control de sesiones y seguridad

2. **Recepción de Llamadas**
   - Popup automático con información ANI/ALI/CNI
   - Sistema de restricciones telefónicas (6 tipos)
   - Clasificación de llamadas en tiempo real
   - Cronómetro de duración

3. **Captura de Incidentes**
   - Formularios dinámicos con widgets reutilizables
   - 7 tipos de involucrados (Personas, Vehículos, Inmuebles, Teléfonos, Armas, Sustancias, Documentos)
   - Sistema de validación completo
   - Generación automática de folios

4. **Despacho de Unidades**
   - Panel de control de unidades de fuerza
   - Asignación y seguimiento de misiones
   - Etapas no reversibles (Asignada → En Camino → En el Lugar → Atendida)
   - Bitácora completa de eventos

5. **Supervisión**
   - Panel de métricas en tiempo real
   - Gestión de restricciones telefónicas
   - Sistema de alertas (medidas cautelares, protección, GEAVI)
   - Control de ausencias
   - Reactivación de incidentes

6. **Administración**
   - CRUD de usuarios y perfiles
   - Gestión de catálogos
   - Configuración del sistema
   - Logs de auditoría

7. **Reportes**
   - Generador con múltiples filtros
   - Exportación a PDF, Excel, CSV
   - Gráficos y estadísticas

## 🛠️ Tecnologías

### Frontend
- React 18 con TypeScript
- Material-UI v5
- Redux Toolkit + React Query
- Socket.io Client
- Leaflet (mapas GIS)
- React Hook Form + Yup

### Backend
- Node.js + Express con TypeScript
- Prisma ORM
- PostgreSQL 16
- Redis 7
- Socket.io
- JWT Authentication

### DevOps
- Docker & Docker Compose
- Vite (build tool)
- ESLint + Prettier

## 📦 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker y Docker Compose (para base de datos)
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd CAD
```

### 2. Configurar variables de entorno

Copiar los archivos de ejemplo y configurar:

```bash
# Root
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Editar los archivos `.env` con tus configuraciones específicas.

### 3. Iniciar servicios de base de datos

```bash
# Iniciar PostgreSQL y Redis
docker-compose up -d postgres redis

# Opcional: Iniciar herramientas de administración
docker-compose --profile tools up -d
```

Verificar que los contenedores estén corriendo:

```bash
docker-compose ps
```

### 4. Instalar dependencias

```bash
# Instalar todas las dependencias del monorepo
npm install
```

### 5. Configurar base de datos

```bash
# Generar cliente Prisma
npm run db:generate --workspace=backend

# Ejecutar migraciones
npm run db:migrate --workspace=backend

# (Opcional) Poblar con datos de prueba
npm run db:seed --workspace=backend
```

### 6. Iniciar el proyecto

```bash
# Desarrollo (frontend + backend simultáneamente)
npm run dev

# O iniciar por separado:
npm run dev:frontend  # Puerto 3000
npm run dev:backend   # Puerto 4000
```

## 🌐 Acceso a la Aplicación

Una vez iniciado el proyecto:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Prisma Studio**: `npm run db:studio --workspace=backend` → http://localhost:5555
- **pgAdmin** (opcional): http://localhost:5050
- **Redis Commander** (opcional): http://localhost:8081

## 👤 Usuario por Defecto

Después de ejecutar el seed:

```
Usuario: ADMIN
Contraseña: Admin123
Perfil: Administrador
```

## 📁 Estructura del Proyecto

```
CAD/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   │   ├── auth/     # Login, perfiles
│   │   │   ├── widgets/  # Widgets del sistema
│   │   │   ├── forms/    # Formularios
│   │   │   ├── layouts/  # Layouts por perfil
│   │   │   └── common/   # Componentes comunes
│   │   ├── modules/      # Módulos principales
│   │   │   ├── llamadas/     # Recepción
│   │   │   ├── incidentes/   # Captura
│   │   │   ├── despacho/     # Despacho
│   │   │   ├── supervision/  # Supervisión
│   │   │   ├── admin/        # Administración
│   │   │   └── reportes/     # Reportes
│   │   ├── services/     # Servicios API
│   │   ├── store/        # Estado global
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── backend/              # API Node.js
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── services/     # Lógica de negocio
│   │   ├── routes/       # Rutas API
│   │   ├── middleware/   # Middleware
│   │   ├── validators/   # Validaciones
│   │   ├── sockets/      # Socket.io eventos
│   │   └── utils/        # Utilidades
│   ├── prisma/
│   │   └── schema.prisma # Esquema de BD
│   └── package.json
│
├── shared/               # Código compartido
│   ├── types/           # Tipos compartidos
│   ├── constants/       # Constantes
│   └── validators/      # Validadores
│
├── docker-compose.yml   # Servicios Docker
├── package.json         # Root package
└── README.md
```

## 🗄️ Base de Datos

### Esquema Principal

El sistema utiliza PostgreSQL con las siguientes tablas principales:

- **users** - Usuarios del sistema
- **profiles** - Perfiles y permisos
- **phone_calls** - Llamadas entrantes
- **phone_restrictions** - Restricciones telefónicas
- **incidents** - Incidentes registrados
- **involved** - Involucrados en incidentes
- **corporations** - Corporaciones de emergencia
- **units** - Unidades de fuerza
- **missions** - Misiones de despacho
- **audit_logs** - Auditoría completa

### Migraciones

```bash
# Crear nueva migración
npm run db:migrate --workspace=backend

# Ver base de datos en Prisma Studio
npm run db:studio --workspace=backend

# Regenerar cliente
npm run db:generate --workspace=backend
```

## 🔧 Scripts Disponibles

### Root
```bash
npm run dev              # Iniciar todo en desarrollo
npm run build            # Build de todo
npm run format           # Formatear código
npm run clean            # Limpiar node_modules
```

### Frontend
```bash
npm run dev:frontend     # Desarrollo
npm run build:frontend   # Producción
npm run preview          # Preview del build
```

### Backend
```bash
npm run dev:backend      # Desarrollo con hot reload
npm run build:backend    # Compilar TypeScript
npm start                # Iniciar servidor producción
```

## 🔐 Seguridad

- Autenticación JWT con tokens de acceso y refresh
- Bcrypt para encriptación de contraseñas (12 rounds)
- Rate limiting en endpoints
- CORS configurado
- Helmet para headers de seguridad
- Validación de inputs con express-validator
- Logs de auditoría inmutables
- Sanitización de datos

## 📊 Monitoreo y Logs

Los logs se guardan en:
- Consola (desarrollo)
- Archivos en `backend/logs/` (producción)
- Base de datos (tabla `audit_logs`)

Niveles de log:
- `error` - Errores críticos
- `warn` - Advertencias
- `info` - Información general
- `debug` - Debug (solo desarrollo)

## 🧪 Testing

```bash
# TODO: Implementar tests
npm run test
npm run test:coverage
```

## 🚢 Despliegue a Producción

### Build

```bash
# Build de frontend y backend
npm run build

# Los archivos compilados estarán en:
# - frontend/dist
# - backend/dist
```

### Variables de Entorno

Asegurarse de configurar en producción:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=... # Cambiar por secreto seguro
REDIS_HOST=...
CORS_ORIGIN=https://tu-dominio.com
```

### Docker

```bash
# TODO: Crear Dockerfile para producción
docker build -t cad-system .
docker run -p 4000:4000 cad-system
```

## 📝 Convenciones de Código

- TypeScript strict mode
- ESLint + Prettier configurados
- Commits descriptivos
- Branches: `feature/`, `fix/`, `hotfix/`

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- Desarrollo: [Tu Equipo]
- Contacto: [Email de contacto]

## 🐛 Reportar Problemas

Abrir un issue en el repositorio con:
- Descripción del problema
- Pasos para reproducir
- Screenshots (si aplica)
- Logs relevantes

## 📚 Documentación Adicional

- [Especificación Técnica Completa](docs/ESPECIFICACION.md)
- [Guía de API](docs/API.md)
- [Manual de Usuario](docs/MANUAL_USUARIO.md)

---

**Sistema CAD v1.0.0** - Sistema de Despacho de Emergencias
