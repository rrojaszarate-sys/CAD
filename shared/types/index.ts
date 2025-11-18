// ============================================
// TIPOS COMPARTIDOS - Sistema CAD
// ============================================

// Estados del sistema
export enum IncidentStatus {
  EN_CAPTURA = 'EN_CAPTURA',
  CANALIZADO = 'CANALIZADO',
  ASIGNADO = 'ASIGNADO',
  EN_PROCESO = 'EN_PROCESO',
  CERRADO = 'CERRADO',
}

export enum Priority {
  CRITICA = 'CRITICA',
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA',
}

export enum UnitStatus {
  DISPONIBLE = 'DISPONIBLE',
  ASIGNADA = 'ASIGNADA',
  EN_CAMINO = 'EN_CAMINO',
  EN_LUGAR = 'EN_LUGAR',
  ATENDIENDO = 'ATENDIENDO',
  NO_DISPONIBLE = 'NO_DISPONIBLE',
}

export enum MissionStatus {
  ASIGNADA = 'ASIGNADA',
  EN_CAMINO = 'EN_CAMINO',
  EN_LUGAR = 'EN_LUGAR',
  ATENDIDA = 'ATENDIDA',
  ATENDIDA_CON_DETENCION = 'ATENDIDA_CON_DETENCION',
  FALSO = 'FALSO',
}

export enum PhoneRestrictionType {
  BROMA = 'BROMA',
  ORDEN = 'ORDEN',
  CAUTELAR = 'CAUTELAR',
  PROTECCION = 'PROTECCION',
  GEAVI = 'GEAVI',
  RECURRENTE = 'RECURRENTE',
}

export enum InvolvedType {
  PERSONA = 'PERSONA',
  VEHICULO = 'VEHICULO',
  INMUEBLE = 'INMUEBLE',
  TELEFONO = 'TELEFONO',
  ARMA = 'ARMA',
  SUSTANCIA = 'SUSTANCIA',
  DOCUMENTO = 'DOCUMENTO',
}

export enum ProfileType {
  OPERADOR = 'OPERADOR',
  DESPACHADOR = 'DESPACHADOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

// Interfaces base
export interface User {
  id: string
  username: string
  email?: string
  firstName: string
  lastName: string
  middleName?: string
  phone?: string
  profileId: string
  profile: Profile
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  name: string
  description?: string
  permissions: Record<string, unknown>
  isActive: boolean
}

export interface Incident {
  id: string
  folio: string
  municipalityId: string
  street: string
  crossStreet?: string
  colonyId?: string
  postalCode: string
  pointOfInterest?: string
  references?: string
  latitude?: number
  longitude?: number
  fullAddress: string
  incidentTypeId: string
  priority: Priority
  priorityLevel: number
  status: IncidentStatus
  callerName?: string
  callerLastName?: string
  callerMiddleName?: string
  callerPhone?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  operatorId: string
}

export interface Unit {
  id: string
  economicNumber: string
  plateNumber?: string
  corporationId: string
  status: UnitStatus
  sector?: string
  isActive: boolean
}

export interface Mission {
  id: string
  incidentId: string
  unitId: string
  status: MissionStatus
  assignedAt: Date
  enRouteAt?: Date
  arrivedAt?: Date
  completedAt?: Date
  responseTime?: number
  totalTime?: number
}

// Tipos de respuesta API
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Eventos Socket.IO
export interface SocketEvents {
  // Llamadas
  'call:incoming': (data: unknown) => void
  'call:ended': (data: { callId: string }) => void

  // Incidentes
  'incident:created': (data: Incident) => void
  'incident:updated': (data: Incident) => void
  'incident:channelized': (data: { incidentId: string }) => void

  // Unidades
  'unit:status_changed': (data: { unitId: string; status: UnitStatus }) => void

  // Misiones
  'mission:assigned': (data: Mission) => void
  'mission:updated': (data: Mission) => void

  // Alertas
  'alert:restriction': (data: unknown) => void
  'alert:supervisor': (data: unknown) => void
}
