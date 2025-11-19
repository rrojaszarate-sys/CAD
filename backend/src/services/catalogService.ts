import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CatalogService {
  // Municipios
  async getMunicipalities() {
    return await prisma.municipio.findMany({
      where: { estaActivo: true },
      orderBy: { nombre: 'asc' },
    })
  }

  async getMunicipalityById(id: string) {
    return await prisma.municipio.findUnique({
      where: { id },
    })
  }

  // Colonias
  async getColonies(municipalityId?: string, search?: string) {
    const where: any = { estaActivo: true }

    if (municipalityId) {
      where.municipioId = municipalityId
    }

    if (search) {
      where.nombre = {
        contains: search,
        mode: 'insensitive',
      }
    }

    return await prisma.colonia.findMany({
      where,
      include: {
        municipio: true,
      },
      orderBy: { nombre: 'asc' },
      take: 50,
    })
  }

  async getColoniesByStreet(streetName: string, municipalityId: string) {
    // En un sistema real, esto buscaría en una tabla de relación calle-colonia
    // Por ahora retornamos todas las colonias del municipio
    return await this.getColonies(municipalityId)
  }

  // Calles
  async getStreets(municipalityId?: string, search?: string) {
    const where: any = { estaActivo: true }

    if (municipalityId) {
      where.municipioId = municipalityId
    }

    if (search && search.length >= 2) {
      where.nombre = {
        contains: search,
        mode: 'insensitive',
      }
    }

    return await prisma.calle.findMany({
      where,
      orderBy: { nombre: 'asc' },
      take: 50,
    })
  }

  // Tipos de Incidente
  async getIncidentTypes() {
    return await prisma.tipoIncidente.findMany({
      where: { estaActivo: true },
      include: {
        padre: true,
        hijos: true,
      },
      orderBy: { nombre: 'asc' },
    })
  }

  async getIncidentTypeHierarchy() {
    // Obtener solo los tipos raíz (categorías)
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
      orderBy: { nombre: 'asc' },
    })

    return rootTypes
  }

  async getIncidentTypeById(id: string) {
    return await prisma.tipoIncidente.findUnique({
      where: { id },
      include: {
        padre: true,
      },
    })
  }

  // Corporaciones
  async getCorporations() {
    return await prisma.corporacion.findMany({
      where: { estaActivo: true },
      orderBy: { nombre: 'asc' },
    })
  }

  async getCorporationById(id: string) {
    return await prisma.corporacion.findUnique({
      where: { id },
      include: {
        unidades: {
          where: { estaActivo: true },
        },
      },
    })
  }

  // Unidades disponibles por corporación
  async getAvailableUnitsByCorporation(corporationId: string) {
    return await prisma.unidad.findMany({
      where: {
        corporacionId: corporationId,
        estaActivo: true,
        estatus: 'DISPONIBLE',
      },
      include: {
        corporacion: true,
      },
      orderBy: { numeroEconomico: 'asc' },
    })
  }

  // Perfiles
  async getProfiles() {
    return await prisma.perfil.findMany({
      where: { estaActivo: true },
      orderBy: { nombre: 'asc' },
    })
  }

  // Stats para widgets
  async getCorporationStats(corporationId: string) {
    const total = await prisma.unidad.count({
      where: {
        corporacionId: corporationId,
        estaActivo: true,
      },
    })

    const available = await prisma.unidad.count({
      where: {
        corporacionId: corporationId,
        estaActivo: true,
        estatus: 'DISPONIBLE',
      },
    })

    const enRoute = await prisma.unidad.count({
      where: {
        corporacionId: corporationId,
        estaActivo: true,
        estatus: 'EN_CAMINO',
      },
    })

    const onSite = await prisma.unidad.count({
      where: {
        corporacionId: corporationId,
        estaActivo: true,
        estatus: 'EN_LUGAR',
      },
    })

    return {
      total,
      available,
      enRoute,
      onSite,
      busy: total - available,
    }
  }
}

export default new CatalogService()
