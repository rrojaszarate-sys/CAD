// ============================================
// VALIDADORES COMPARTIDOS - Sistema CAD
// ============================================

import { VALIDATION_PATTERNS, LIMITS } from '../constants'

// Validador de teléfono
export function isValidPhone(phone: string): boolean {
  return VALIDATION_PATTERNS.PHONE.test(phone)
}

// Validador de email
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email)
}

// Validador de placa
export function isValidPlate(plate: string): boolean {
  return VALIDATION_PATTERNS.PLATE.test(plate)
}

// Validador de código postal
export function isValidPostalCode(postalCode: string): boolean {
  return VALIDATION_PATTERNS.POSTAL_CODE.test(postalCode)
}

// Validador de contraseña
export function isValidPassword(password: string): boolean {
  if (
    password.length < LIMITS.PASSWORD_MIN_LENGTH ||
    password.length > LIMITS.PASSWORD_MAX_LENGTH
  ) {
    return false
  }

  // Debe contener al menos una mayúscula
  const hasUpperCase = /[A-Z]/.test(password)
  // Debe contener al menos un número
  const hasNumber = /\d/.test(password)

  return hasUpperCase && hasNumber
}

// Validador de username
export function isValidUsername(username: string): boolean {
  // Solo alfanuméricos, sin espacios
  const pattern = /^[a-zA-Z0-9_]+$/
  return pattern.test(username) && username.length > 0 && username.length <= 20
}

// Formateador de teléfono
export function formatPhone(phone: string): string {
  // Eliminar todo excepto números
  const cleaned = phone.replace(/\D/g, '')

  // Si tiene 10 dígitos, formatear como XX-XXXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

// Formateador de placa
export function formatPlate(plate: string): string {
  const cleaned = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')

  // Formato ABC-123-D
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return plate.toUpperCase()
}

// Validador de folio
export function isValidFolio(folio: string): boolean {
  // Formato: EDOMEX/1/19111100072
  const pattern = /^[A-Z]+\/\d+\/\d{11}$/
  return pattern.test(folio)
}

// Generador de folio
export function generateFolio(prefix: string, centerId: number): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 24
  const month = String(now.getMonth() + 1).padStart(2, '0') // 01-12
  const day = String(now.getDate()).padStart(2, '0') // 01-31
  const hour = String(now.getHours()).padStart(2, '0') // 00-23
  const minute = String(now.getMinutes()).padStart(2, '0') // 00-59
  const second = String(now.getSeconds()).padStart(2, '0') // 00-59
  const ms = String(now.getMilliseconds()).padStart(3, '0') // 000-999

  const sequence = `${year}${month}${day}${hour}${minute}${second}${ms}`

  return `${prefix}/${centerId}/${sequence}`
}

// Validar que sea un número válido
export function isValidNumber(value: unknown): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

// Validar coordenadas GPS
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    isValidNumber(lat) &&
    isValidNumber(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

// Sanitizar texto (eliminar caracteres peligrosos)
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Eliminar < y >
    .trim()
}

// Validar longitud de texto
export function isValidLength(
  text: string,
  min: number,
  max: number
): boolean {
  return text.length >= min && text.length <= max
}
