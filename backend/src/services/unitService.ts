import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UnitService {
  async getAll(corporacionId?: string, estatus?: string) {
    const where: any = { estaActivo: true }
    if (corporacionId) where.corporacionId = corporacionId
    if (estatus) where.estatus = estatus

    return await prisma.unidad.findMany({
      where,
      include: { corporacion: true },
      orderBy: { numeroEconomico: 'asc' },
    })
  }

  async getById(id: string) {
    const unidad = await prisma.unidad.findUnique({
      where: { id },
      include: { corporacion: true },
    })
    if (!unidad) throw new Error('Unidad no encontrada')
    return unidad
  }

  async create(data: any, createdBy: string) {
    const unidad = await prisma.unidad.create({
      data,
      include: { corporacion: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'UNIDAD',
        entidadId: unidad.id,
        datosPosteriores: { numeroEconomico: unidad.numeroEconomico },
      },
    })
    return unidad
  }

  async update(id: string, data: any, updatedBy: string) {
    const unidad = await prisma.unidad.update({
      where: { id },
      data,
      include: { corporacion: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'UNIDAD',
        entidadId: id,
        datosPosteriores: { numeroEconomico: unidad.numeroEconomico },
      },
    })
    return unidad
  }

  async delete(id: string, deletedBy: string) {
    await prisma.unidad.update({ where: { id }, data: { estaActivo: false } })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'UNIDAD',
        entidadId: id,
      },
    })
    return { success: true }
  }

  async changeStatus(id: string, estatus: string, updatedBy: string) {
    const unidad = await prisma.unidad.update({
      where: { id },
      data: { estatus },
    })

    await prisma.registroUnidad.create({
      data: {
        unidadId: id,
        estatusAnterior: unidad.estatus,
        estatusNuevo: estatus,
        observaciones: `Cambio de estatus a ${estatus}`,
      },
    })

    return unidad
  }
}

export default new UnitService()
