import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateProfileDto {
  nombre: string
  descripcion?: string
  permisos: any
}

export interface UpdateProfileDto {
  nombre?: string
  descripcion?: string
  permisos?: any
  estaActivo?: boolean
}

export class ProfileService {
  async getAllProfiles(includeInactive = false) {
    const where = includeInactive ? {} : { estaActivo: true }

    return await prisma.perfil.findMany({
      where,
      include: {
        _count: {
          select: {
            usuarios: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    })
  }

  async getProfileById(id: string) {
    const perfil = await prisma.perfil.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nombreUsuario: true,
            nombre: true,
            apellidoPaterno: true,
            estaActivo: true,
          },
        },
      },
    })

    if (!perfil) {
      throw new Error('Perfil no encontrado')
    }

    return perfil
  }

  async createProfile(data: CreateProfileDto, createdBy: string) {
    const perfil = await prisma.perfil.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        permisos: data.permisos,
      },
    })

    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'PERFIL',
        entidadId: perfil.id,
        datosPosteriores: {
          nombre: perfil.nombre,
        },
      },
    })

    return perfil
  }

  async updateProfile(id: string, data: UpdateProfileDto, updatedBy: string) {
    const perfil = await prisma.perfil.findUnique({ where: { id } })
    if (!perfil) throw new Error('Perfil no encontrado')

    const perfilActualizado = await prisma.perfil.update({
      where: { id },
      data,
    })

    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'PERFIL',
        entidadId: id,
        datosAnteriores: { nombre: perfil.nombre },
        datosPosteriores: { nombre: perfilActualizado.nombre },
      },
    })

    return perfilActualizado
  }

  async deleteProfile(id: string, deletedBy: string) {
    const perfil = await prisma.perfil.findUnique({ where: { id } })
    if (!perfil) throw new Error('Perfil no encontrado')

    // Verificar que no tenga usuarios asignados
    const usuariosCount = await prisma.usuario.count({
      where: { perfilId: id },
    })

    if (usuariosCount > 0) {
      throw new Error('No se puede eliminar un perfil con usuarios asignados')
    }

    await prisma.perfil.update({
      where: { id },
      data: { estaActivo: false },
    })

    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'PERFIL',
        entidadId: id,
        datosAnteriores: { nombre: perfil.nombre },
      },
    })

    return { success: true }
  }
}

export default new ProfileService()
