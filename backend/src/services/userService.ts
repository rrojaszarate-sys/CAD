import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12')

export interface CreateUserDto {
  nombreUsuario: string
  contrasena: string
  correoElectronico?: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  perfilId: string
  municipiosIds?: string[]
  corporacionesIds?: string[]
  accesoTelefoniaHabilitado?: boolean
  extension?: string
  extensionActiva?: boolean
}

export interface UpdateUserDto {
  correoElectronico?: string
  nombre?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  perfilId?: string
  municipiosIds?: string[]
  corporacionesIds?: string[]
  accesoTelefoniaHabilitado?: boolean
  extension?: string
  extensionActiva?: boolean
  estaActivo?: boolean
}

export interface ChangePasswordDto {
  contrasenaActual: string
  contrasenaNueva: string
}

export class UserService {
  // Listar todos los usuarios
  async getAllUsers(filters?: {
    perfilId?: string
    estaActivo?: boolean
    search?: string
  }) {
    const where: any = {}

    if (filters?.perfilId) {
      where.perfilId = filters.perfilId
    }

    if (filters?.estaActivo !== undefined) {
      where.estaActivo = filters.estaActivo
    }

    if (filters?.search) {
      where.OR = [
        { nombreUsuario: { contains: filters.search, mode: 'insensitive' } },
        { nombre: { contains: filters.search, mode: 'insensitive' } },
        { apellidoPaterno: { contains: filters.search, mode: 'insensitive' } },
        { correoElectronico: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return await prisma.usuario.findMany({
      where,
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
      orderBy: { nombreUsuario: 'asc' },
    })
  }

  // Obtener un usuario por ID
  async getUserById(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
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
      throw new Error('Usuario no encontrado')
    }

    return usuario
  }

  // Crear usuario
  async createUser(data: CreateUserDto, createdBy: string) {
    // Verificar que el nombre de usuario no exista
    const existingUser = await prisma.usuario.findUnique({
      where: { nombreUsuario: data.nombreUsuario.toUpperCase() },
    })

    if (existingUser) {
      throw new Error('El nombre de usuario ya existe')
    }

    // Verificar que el correo no exista si se proporciona
    if (data.correoElectronico) {
      const existingEmail = await prisma.usuario.findUnique({
        where: { correoElectronico: data.correoElectronico },
      })

      if (existingEmail) {
        throw new Error('El correo electrónico ya está registrado')
      }
    }

    // Verificar que el perfil exista
    const perfil = await prisma.perfil.findUnique({
      where: { id: data.perfilId },
    })

    if (!perfil) {
      throw new Error('El perfil especificado no existe')
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.contrasena, BCRYPT_ROUNDS)

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombreUsuario: data.nombreUsuario.toUpperCase(),
        contrasena: hashedPassword,
        correoElectronico: data.correoElectronico,
        nombre: data.nombre,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        perfilId: data.perfilId,
        accesoTelefoniaHabilitado: data.accesoTelefoniaHabilitado || false,
        extension: data.extension,
        extensionActiva: data.extensionActiva || false,
      },
      include: {
        perfil: true,
      },
    })

    // Asignar municipios si se proporcionan
    if (data.municipiosIds && data.municipiosIds.length > 0) {
      await Promise.all(
        data.municipiosIds.map((municipioId) =>
          prisma.usuarioMunicipio.create({
            data: {
              usuarioId: usuario.id,
              municipioId,
            },
          })
        )
      )
    }

    // Asignar corporaciones si se proporcionan
    if (data.corporacionesIds && data.corporacionesIds.length > 0) {
      await Promise.all(
        data.corporacionesIds.map((corporacionId) =>
          prisma.usuarioCorporacion.create({
            data: {
              usuarioId: usuario.id,
              corporacionId,
            },
          })
        )
      )
    }

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'USUARIO',
        entidadId: usuario.id,
        datosPosteriores: {
          nombreUsuario: usuario.nombreUsuario,
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          perfil: perfil.nombre,
        },
      },
    })

    return usuario
  }

  // Actualizar usuario
  async updateUser(id: string, data: UpdateUserDto, updatedBy: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { perfil: true },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Verificar correo si se está actualizando
    if (data.correoElectronico && data.correoElectronico !== usuario.correoElectronico) {
      const existingEmail = await prisma.usuario.findUnique({
        where: { correoElectronico: data.correoElectronico },
      })

      if (existingEmail) {
        throw new Error('El correo electrónico ya está registrado')
      }
    }

    // Actualizar datos básicos
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: {
        correoElectronico: data.correoElectronico,
        nombre: data.nombre,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        perfilId: data.perfilId,
        accesoTelefoniaHabilitado: data.accesoTelefoniaHabilitado,
        extension: data.extension,
        extensionActiva: data.extensionActiva,
        estaActivo: data.estaActivo,
      },
      include: {
        perfil: true,
      },
    })

    // Actualizar municipios si se proporcionan
    if (data.municipiosIds !== undefined) {
      // Eliminar asignaciones existentes
      await prisma.usuarioMunicipio.deleteMany({
        where: { usuarioId: id },
      })

      // Crear nuevas asignaciones
      if (data.municipiosIds.length > 0) {
        await Promise.all(
          data.municipiosIds.map((municipioId) =>
            prisma.usuarioMunicipio.create({
              data: {
                usuarioId: id,
                municipioId,
              },
            })
          )
        )
      }
    }

    // Actualizar corporaciones si se proporcionan
    if (data.corporacionesIds !== undefined) {
      // Eliminar asignaciones existentes
      await prisma.usuarioCorporacion.deleteMany({
        where: { usuarioId: id },
      })

      // Crear nuevas asignaciones
      if (data.corporacionesIds.length > 0) {
        await Promise.all(
          data.corporacionesIds.map((corporacionId) =>
            prisma.usuarioCorporacion.create({
              data: {
                usuarioId: id,
                corporacionId,
              },
            })
          )
        )
      }
    }

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'USUARIO',
        entidadId: id,
        datosAnteriores: {
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          perfil: usuario.perfil.nombre,
          estaActivo: usuario.estaActivo,
        },
        datosPosteriores: {
          nombre: usuarioActualizado.nombre,
          apellidoPaterno: usuarioActualizado.apellidoPaterno,
          perfil: usuarioActualizado.perfil.nombre,
          estaActivo: usuarioActualizado.estaActivo,
        },
      },
    })

    return usuarioActualizado
  }

  // Cambiar contraseña
  async changePassword(id: string, data: ChangePasswordDto) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(data.contrasenaActual, usuario.contrasena)

    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta')
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(data.contrasenaNueva, BCRYPT_ROUNDS)

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id },
      data: {
        contrasena: hashedPassword,
      },
    })

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: id,
        accion: 'PASSWORD_CHANGE',
        entidad: 'USUARIO',
        entidadId: id,
        datosPosteriores: {
          timestamp: new Date().toISOString(),
        },
      },
    })

    return { success: true }
  }

  // Resetear contraseña (por administrador)
  async resetPassword(id: string, nuevaContrasena: string, resetBy: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, BCRYPT_ROUNDS)

    // Actualizar contraseña y resetear intentos
    await prisma.usuario.update({
      where: { id },
      data: {
        contrasena: hashedPassword,
        intentosLogin: 0,
        estaBloqueado: false,
      },
    })

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: resetBy,
        accion: 'PASSWORD_RESET',
        entidad: 'USUARIO',
        entidadId: id,
        datosPosteriores: {
          resetBy: resetBy,
          timestamp: new Date().toISOString(),
        },
      },
    })

    return { success: true }
  }

  // Desbloquear usuario
  async unlockUser(id: string, unlockedBy: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    await prisma.usuario.update({
      where: { id },
      data: {
        estaBloqueado: false,
        intentosLogin: 0,
      },
    })

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: unlockedBy,
        accion: 'UNLOCK',
        entidad: 'USUARIO',
        entidadId: id,
        datosPosteriores: {
          unlockedBy: unlockedBy,
          timestamp: new Date().toISOString(),
        },
      },
    })

    return { success: true }
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(id: string, toggledBy: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    const nuevoEstado = !usuario.estaActivo

    await prisma.usuario.update({
      where: { id },
      data: {
        estaActivo: nuevoEstado,
      },
    })

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: toggledBy,
        accion: nuevoEstado ? 'ACTIVATE' : 'DEACTIVATE',
        entidad: 'USUARIO',
        entidadId: id,
        datosPosteriores: {
          estaActivo: nuevoEstado,
          timestamp: new Date().toISOString(),
        },
      },
    })

    return { success: true, estaActivo: nuevoEstado }
  }

  // Eliminar usuario (soft delete)
  async deleteUser(id: string, deletedBy: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { perfil: true },
    })

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Soft delete
    await prisma.usuario.update({
      where: { id },
      data: {
        estaActivo: false,
      },
    })

    // Registrar en auditoría
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'USUARIO',
        entidadId: id,
        datosAnteriores: {
          nombreUsuario: usuario.nombreUsuario,
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          perfil: usuario.perfil.nombre,
        },
      },
    })

    return { success: true }
  }
}

export default new UserService()
