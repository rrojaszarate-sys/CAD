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
    const user = await prisma.user.findUnique({
      where: { username: username.toUpperCase() },
      include: {
        profile: true,
        municipalities: {
          include: {
            municipality: true,
          },
        },
        corporations: {
          include: {
            corporation: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuario no registrado en el sistema')
    }

    // Verificar si está activo
    if (!user.isActive) {
      throw new Error('Usuario inactivo')
    }

    // Verificar si está bloqueado
    if (user.isBlocked) {
      throw new Error('Usuario bloqueado por múltiples intentos fallidos')
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      await this.handleFailedLogin(user.id)
      throw new Error('Contraseña incorrecta')
    }

    // Validar acceso por telefonía si aplica
    if (phoneAccess) {
      if (!user.phoneAccessEnabled) {
        throw new Error('Usuario no tiene acceso por telefonía habilitado')
      }

      if (!user.extensionActive) {
        throw new Error('Extensión no está dada de alta o no se encuentra activa')
      }

      if (extension && user.extension !== extension) {
        throw new Error('Extensión no coincide')
      }
    }

    // Validar perfil si se especifica
    if (profileId && user.profileId !== profileId) {
      throw new Error('Perfil no asignado al usuario')
    }

    // Reset intentos fallidos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lastLogin: new Date(),
      },
    })

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'USER',
        entityId: user.id,
        afterData: {
          username: user.username,
          timestamp: new Date().toISOString(),
        },
      },
    })

    // Generar tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      username: user.username,
      profileId: user.profile.id,
      profileName: user.profile.name,
    }

    const tokens = generateTokenPair(tokenPayload)

    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || undefined,
        profile: {
          id: user.profile.id,
          name: user.profile.name,
          permissions: user.profile.permissions,
        },
      },
      tokens,
    }
  }

  async handleFailedLogin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return

    const newAttempts = user.loginAttempts + 1

    // Si alcanza el máximo, bloquear
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          loginAttempts: newAttempts,
          isBlocked: true,
        },
      })

      // Programar desbloqueo automático (esto debería manejarse con un job)
      // Por ahora solo incrementamos intentos
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          loginAttempts: newAttempts,
        },
      })
    }
  }

  async logout(userId: string): Promise<void> {
    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        entity: 'USER',
        entityId: userId,
        afterData: {
          timestamp: new Date().toISOString(),
        },
      },
    })

    // En una implementación completa, aquí se invalidaría el token en Redis
  }

  async getAvailableProfiles(username: string): Promise<any[]> {
    const user = await prisma.user.findUnique({
      where: { username: username.toUpperCase() },
      include: {
        profile: true,
      },
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    // Por ahora solo retornamos el perfil del usuario
    // En un sistema más complejo, un usuario podría tener múltiples perfiles
    return [user.profile]
  }

  async validateExtension(extension: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        extension,
        extensionActive: true,
        phoneAccessEnabled: true,
      },
    })

    return !!user
  }
}

export default new AuthService()
