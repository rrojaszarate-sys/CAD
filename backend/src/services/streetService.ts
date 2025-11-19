import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class StreetService {
  async getAll(municipioId?: string, search?: string) {
    const where: any = { estaActivo: true }
    if (municipioId) where.municipioId = municipioId
    if (search) where.nombre = { contains: search, mode: 'insensitive' }

    return await prisma.calle.findMany({
      where,
      include: { municipio: true },
      orderBy: { nombre: 'asc' },
    })
  }

  async getById(id: string) {
    const calle = await prisma.calle.findUnique({
      where: { id },
      include: { municipio: true },
    })
    if (!calle) throw new Error('Calle no encontrada')
    return calle
  }

  async create(data: any, createdBy: string) {
    const calle = await prisma.calle.create({
      data,
      include: { municipio: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'CALLE',
        entidadId: calle.id,
        datosPosteriores: { nombre: calle.nombre },
      },
    })
    return calle
  }

  async update(id: string, data: any, updatedBy: string) {
    const calle = await prisma.calle.update({
      where: { id },
      data,
      include: { municipio: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'CALLE',
        entidadId: id,
        datosPosteriores: { nombre: calle.nombre },
      },
    })
    return calle
  }

  async delete(id: string, deletedBy: string) {
    await prisma.calle.update({ where: { id }, data: { estaActivo: false } })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'CALLE',
        entidadId: id,
      },
    })
    return { success: true }
  }
}

export default new StreetService()
