import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CorporationService {
  async getAll(includeInactive = false) {
    return await prisma.corporacion.findMany({
      where: includeInactive ? {} : { estaActivo: true },
      include: {
        _count: {
          select: {
            unidades: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    })
  }

  async getById(id: string) {
    const corporacion = await prisma.corporacion.findUnique({
      where: { id },
      include: {
        unidades: {
          where: { estaActivo: true },
        },
      },
    })
    if (!corporacion) throw new Error('Corporación no encontrada')
    return corporacion
  }

  async create(data: any, createdBy: string) {
    const corporacion = await prisma.corporacion.create({ data })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'CORPORACION',
        entidadId: corporacion.id,
        datosPosteriores: { nombre: corporacion.nombre },
      },
    })
    return corporacion
  }

  async update(id: string, data: any, updatedBy: string) {
    const corporacion = await prisma.corporacion.update({ where: { id }, data })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'CORPORACION',
        entidadId: id,
        datosPosteriores: { nombre: corporacion.nombre },
      },
    })
    return corporacion
  }

  async delete(id: string, deletedBy: string) {
    const unidadesCount = await prisma.unidad.count({
      where: { corporacionId: id, estaActivo: true },
    })

    if (unidadesCount > 0) {
      throw new Error('No se puede eliminar una corporación con unidades activas')
    }

    await prisma.corporacion.update({ where: { id }, data: { estaActivo: false } })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'CORPORACION',
        entidadId: id,
      },
    })
    return { success: true }
  }
}

export default new CorporationService()
