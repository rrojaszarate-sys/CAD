// ============================================
// CONSTANTES COMPARTIDAS - Sistema CAD
// ============================================

// Límites del sistema
export const LIMITS = {
  MAX_LOGIN_ATTEMPTS: 3,
  SESSION_TIMEOUT_MINUTES: 30,
  MAX_FILE_SIZE_MB: 10,
  MAX_PERSONS_PER_INCIDENT: 50,
  MAX_VEHICLES_PER_INCIDENT: 20,
  MAX_NOTES_LENGTH: 500,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 16,
} as const

// Tiempos de respuesta esperados (en minutos)
export const RESPONSE_TIMES = {
  CRITICA: 3,
  ALTA: 5,
  MEDIA: 10,
  BAJA: 30,
} as const

// Colores de prioridad
export const PRIORITY_COLORS = {
  CRITICA: '#f44336', // Rojo
  ALTA: '#ff9800',    // Naranja
  MEDIA: '#ffeb3b',   // Amarillo
  BAJA: '#4caf50',    // Verde
} as const

// Colores de restricciones telefónicas
export const RESTRICTION_COLORS = {
  BROMA: '#000000',      // Negro
  ORDEN: '#f44336',      // Rojo
  CAUTELAR: '#ffeb3b',   // Amarillo
  PROTECCION: '#ff9800', // Naranja
  GEAVI: '#ffc0cb',      // Rosa
  RECURRENTE: '#000080', // Azul marino
} as const

// Colores de estado de unidades
export const UNIT_STATUS_COLORS = {
  DISPONIBLE: '#4caf50',     // Verde
  ASIGNADA: '#2196f3',       // Azul
  EN_CAMINO: '#ffeb3b',      // Amarillo
  EN_LUGAR: '#ff9800',       // Naranja
  ATENDIENDO: '#9c27b0',     // Púrpura
  NO_DISPONIBLE: '#9e9e9e',  // Gris
} as const

// Nombres de estados legibles
export const STATUS_LABELS = {
  // Incidentes
  EN_CAPTURA: 'En Captura',
  CANALIZADO: 'Canalizado',
  ASIGNADO: 'Asignado',
  EN_PROCESO: 'En Proceso',
  CERRADO: 'Cerrado',

  // Prioridades
  CRITICA: 'Crítica',
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',

  // Unidades
  DISPONIBLE: 'Disponible',
  ASIGNADA: 'Asignada',
  EN_CAMINO: 'En Camino',
  EN_LUGAR: 'En el Lugar',
  ATENDIENDO: 'Atendiendo',
  NO_DISPONIBLE: 'No Disponible',
} as const

// Patrones de validación
export const VALIDATION_PATTERNS = {
  PHONE: /^\d{2}-\d{4}-\d{4}$/,
  PLATE: /^[A-Z]{3}-\d{3}-[A-Z]$/,
  POSTAL_CODE: /^\d{5}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

// Mensajes de error
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_FORMAT: 'Formato inválido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Formato de teléfono inválido (XX-XXXX-XXXX)',
  INVALID_PLATE: 'Formato de placa inválido (ABC-123-D)',
  PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${LIMITS.PASSWORD_MIN_LENGTH} caracteres`,
  PASSWORD_TOO_LONG: `La contraseña no puede tener más de ${LIMITS.PASSWORD_MAX_LENGTH} caracteres`,
  PASSWORD_REQUIREMENTS: 'La contraseña debe contener al menos una mayúscula y un número',
  USERNAME_TAKEN: 'Este nombre de usuario ya está en uso',
  LOGIN_FAILED: 'Usuario o contraseña incorrectos',
  ACCOUNT_BLOCKED: 'Cuenta bloqueada por múltiples intentos fallidos',
  SESSION_EXPIRED: 'Sesión expirada',
  UNAUTHORIZED: 'No autorizado',
  COLONY_REQUIRED: 'Necesario seleccionar una colonia para el Domicilio del Incidente',
} as const

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// Configuración de Socket.IO
export const SOCKET_EVENTS = {
  // Conexión
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Llamadas
  CALL_INCOMING: 'call:incoming',
  CALL_ENDED: 'call:ended',

  // Incidentes
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_UPDATED: 'incident:updated',
  INCIDENT_CHANNELIZED: 'incident:channelized',

  // Unidades
  UNIT_STATUS_CHANGED: 'unit:status_changed',

  // Misiones
  MISSION_ASSIGNED: 'mission:assigned',
  MISSION_UPDATED: 'mission:updated',

  // Alertas
  ALERT_RESTRICTION: 'alert:restriction',
  ALERT_SUPERVISOR: 'alert:supervisor',
} as const
