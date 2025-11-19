import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class IncidentTypeService {
  async getAll(includeInactive = false) {
    return await prisma.tipoIncidente.findMany({
      where: includeInactive ? {} : { estaActivo: true },
      include: {
        padre: true,
        hijos: {
          where: { estaActivo: true },
        },
      },
      orderBy: { codigo: 'asc' },
    })
  }

  async getHierarchy() {
    const rootTypes = await prisma.tipoIncidente.findMany({
      where: {
        estaActivo: true,
        padreId: null,
      },
      include: {
        hijos: {
          where: { estaActivo: true },
          include: {
            hijos: {
              where: { estaActivo: true },
            },
          },
        },
      },
      orderBy: { codigo: 'asc' },
    })

    return rootTypes
  }

  async getById(id: string) {
    const tipo = await prisma.tipoIncidente.findUnique({
      where: { id },
      include: {
        padre: true,
        hijos: true,
      },
    })
    if (!tipo) throw new Error('Tipo de incidente no encontrado')
    return tipo
  }

  async create(data: any, createdBy: string) {
    const tipo = await prisma.tipoIncidente.create({
      data,
      include: { padre: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: createdBy,
        accion: 'CREATE',
        entidad: 'TIPO_INCIDENTE',
        entidadId: tipo.id,
        datosPosteriores: { codigo: tipo.codigo, nombre: tipo.nombre },
      },
    })
    return tipo
  }

  async update(id: string, data: any, updatedBy: string) {
    const tipo = await prisma.tipoIncidente.update({
      where: { id },
      data,
      include: { padre: true },
    })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: updatedBy,
        accion: 'UPDATE',
        entidad: 'TIPO_INCIDENTE',
        entidadId: id,
        datosPosteriores: { codigo: tipo.codigo, nombre: tipo.nombre },
      },
    })
    return tipo
  }

  async delete(id: string, deletedBy: string) {
    const hijosCount = await prisma.tipoIncidente.count({
      where: { padreId: id, estaActivo: true },
    })

    if (hijosCount > 0) {
      throw new Error('No se puede eliminar un tipo con subtipos activos')
    }

    await prisma.tipoIncidente.update({ where: { id }, data: { estaActivo: false } })
    await prisma.registroAuditoria.create({
      data: {
        usuarioId: deletedBy,
        accion: 'DELETE',
        entidad: 'TIPO_INCIDENTE',
        entidadId: id,
      },
    })
    return { success: true }
  }
}

export default new IncidentTypeService()
