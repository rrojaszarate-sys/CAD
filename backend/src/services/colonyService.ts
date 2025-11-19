import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ColonyService {
  async getAll(municipioId?: string, search?: string) {
    const where: any = { estaActivo: true }
    if (municipioId) where.municipioId = municipioId
    if (search) where.nombre = { contains: search, mode: 'insensitive' }

    return await prisma.colonia.findMany({
      where,
      include: { municipio: true },
      orderBy: { nombre: 'asc' },
    })
  }

  async getById(id: string) {
    const colonia = await prisma.colonia.findUnique({
      where: { id },
      include: { municipio: true },
    })
    if (!colonia) throw new Error('Colonia no encontrada')
    return colonia
  }

  async create(data: any, createdBy: string) {
    const colonia = await prisma.colonia.create({
      data,
      include: { municipio: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'COLONIA',
        entidadId: colonia.id,
        datosPosteriores: { nombre: colonia.nombre },
      },
    })
    return colonia
  }

  async update(id: string, data: any, updatedBy: string) {
    const colonia = await prisma.colonia.update({
      where: { id },
      data,
      include: { municipio: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'COLONIA',
        entidadId: id,
        datosPosteriores: { nombre: colonia.nombre },
      },
    })
    return colonia
  }

  async delete(id: string, deletedBy: string) {
    await prisma.colonia.update({ where: { id }, data: { estaActivo: false } })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'COLONIA',
        entidadId: id,
      },
    })
    return { success: true }
  }
}

export default new ColonyService()
