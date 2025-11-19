import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateTokenPair, TokenPayload } from '../utils/jwt.js'

const prisma = new PrismaClient()
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '3')
const LOCK_TIME = parseInt(process.env.LOCK_TIME || '5') * 60 * 1000 // En ms

export interface LoginCredentials {
  username: string
  password: string
  profileId?: string
  phoneAccess?: boolean
  extension?: string
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    middleName?: string
    email?: string
    profile: {
      id: string
      name: string
      permissions: any
    }
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { username, password, profileId, phoneAccess, extension } = credentials

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { nombreUsuario: username.toUpperCase() },
      include: {
        perfil: true,
        municipios: {
          include: {
            municipio: true,
          },
        },
        corporaciones: {
          include: {
            corporacion: true,
          },
        },
      },
    })

    if (!usuario) {
      throw new Error('Usuario no registrado en el sistema')
    }

    // Verificar si está activo
    if (!usuario.estaActivo) {
      throw new Error('Usuario inactivo')
    }

    // Verificar si está bloqueado
    if (usuario.estaBloqueado) {
      throw new Error('Usuario bloqueado por múltiples intentos fallidos')
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.contrasena)

    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      await this.handleFailedLogin(usuario.id)
      throw new Error('Contraseña incorrecta')
    }

    // Validar acceso por telefonía si aplica
    if (phoneAccess) {
      if (!usuario.accesoTelefoniaHabilitado) {
        throw new Error('Usuario no tiene acceso por telefonía habilitado')
      }

      if (!usuario.extensionActiva) {
        throw new Error('Extensión no está dada de alta o no se encuentra activa')
      }

      if (extension && usuario.extension !== extension) {
        throw new Error('Extensión no coincide')
      }
    }

    // Validar perfil si se especifica
    if (profileId && usuario.perfilId !== profileId) {
      throw new Error('Perfil no asignado al usuario')
    }

    // Reset intentos fallidos
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        intentosLogin: 0,
        ultimoLogin: new Date(),
      },
    })

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: usuario.id,
        accion: 'LOGIN',
        entidad: 'USUARIO',
        entidadId: usuario.id,
        datosPosteriores: {
          nombreUsuario: usuario.nombreUsuario,
          timestamp: new Date().toISOString(),
        },
      },
    })

    // Generar tokens
    const tokenPayload: TokenPayload = {
      userId: usuario.id,
      username: usuario.nombreUsuario,
      profileId: usuario.perfil.id,
      profileName: usuario.perfil.nombre,
    }

    const tokens = generateTokenPair(tokenPayload)

    return {
      user: {
        id: usuario.id,
        username: usuario.nombreUsuario,
        firstName: usuario.nombre,
        lastName: usuario.apellidoPaterno,
        middleName: usuario.apellidoMaterno || undefined,
        email: usuario.correoElectronico || undefined,
        profile: {
          id: usuario.perfil.id,
          name: usuario.perfil.nombre,
          permissions: usuario.perfil.permisos,
        },
      },
      tokens,
    }
  }

  async handleFailedLogin(userId: string): Promise<void> {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    })

    if (!usuario) return

    const newAttempts = usuario.intentosLogin + 1

    // Si alcanza el máximo, bloquear
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      await prisma.usuario.update({
        where: { id: userId },
        data: {
          intentosLogin: newAttempts,
          estaBloqueado: true,
        },
      })

      // Programar desbloqueo automático (esto debería manejarse con un job)
      // Por ahora solo incrementamos intentos
    } else {
      await prisma.usuario.update({
        where: { id: userId },
        data: {
          intentosLogin: newAttempts,
        },
      })
    }
  }

  async logout(userId: string): Promise<void> {
    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: userId,
        accion: 'LOGOUT',
        entidad: 'USUARIO',
        entidadId: userId,
        datosPosteriores: {
          timestamp: new Date().toISOString(),
        },
      },
    })

    // En una implementación completa, aquí se invalidaría el token en Redis
  }

  async getAvailableProfiles(username: string): Promise<any[]> {
    const usuario = await prisma.usuario.findUnique({
      where: { nombreUsuario: username.toUpperCase() },
      include: {
        perfil: true,
      },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Por ahora solo retornamos el perfil del usuario
    // En un sistema más complejo, un usuario podría tener múltiples perfiles
    return [usuario.perfil]
  }

  async validateExtension(extension: string): Promise<boolean> {
    const usuario = await prisma.usuario.findFirst({
      where: {
        extension,
        extensionActiva: true,
        accesoTelefoniaHabilitado: true,
      },
    })

    return !!usuario
  }
}

export default new AuthService()
