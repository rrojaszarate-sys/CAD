import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class MunicipalityService {
  async getAll(includeInactive = false) {
    return await prisma.municipio.findMany({
      where: includeInactive ? {} : { estaActivo: true },
      orderBy: { nombre: 'asc' },
    })
  }

  async getById(id: string) {
    const municipio = await prisma.municipio.findUnique({ where: { id } })
    if (!municipio) throw new Error('Municipio no encontrado')
    return municipio
  }

  async create(data: any, createdBy: string) {
    const municipio = await prisma.municipio.create({ data })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'MUNICIPIO',
        entidadId: municipio.id,
        datosPosteriores: { nombre: municipio.nombre },
      },
    })
    return municipio
  }

  async update(id: string, data: any, updatedBy: string) {
    const municipio = await prisma.municipio.update({ where: { id }, data })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'MUNICIPIO',
        entidadId: id,
        datosPosteriores: { nombre: municipio.nombre },
      },
    })
    return municipio
  }

  async delete(id: string, deletedBy: string) {
    await prisma.municipio.update({ where: { id }, data: { estaActivo: false } })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'MUNICIPIO',
        entidadId: id,
      },
    })
    return { success: true }
  }
}

export default new MunicipalityService()
