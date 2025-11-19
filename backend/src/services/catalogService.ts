import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CatalogService {
  // Municipios
  async getMunicipalities() {
    return await prisma.municipality.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  async getMunicipalityById(id: string) {
    return await prisma.municipality.findUnique({
      where: { id },
    })
  }

  // Colonias
  async getColonies(municipalityId?: string, search?: string) {
    const where: any = { isActive: true }

    if (municipalityId) {
      where.municipalityId = municipalityId
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    return await prisma.colony.findMany({
      where,
      include: {
        municipality: true,
      },
      orderBy: { name: 'asc' },
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
    const where: any = { isActive: true }

    if (municipalityId) {
      where.municipalityId = municipalityId
    }

    if (search && search.length >= 2) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    return await prisma.street.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 50,
    })
  }

  // Tipos de Incidente
  async getIncidentTypes() {
    return await prisma.incidentType.findMany({
      where: { isActive: true },
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    })
  }

  async getIncidentTypeHierarchy() {
    // Obtener solo los tipos raíz (categorías)
    const rootTypes = await prisma.incidentType.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return rootTypes
  }

  async getIncidentTypeById(id: string) {
    return await prisma.incidentType.findUnique({
      where: { id },
      include: {
        parent: true,
      },
    })
  }

  // Corporaciones
  async getCorporations() {
    return await prisma.corporation.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  async getCorporationById(id: string) {
    return await prisma.corporation.findUnique({
      where: { id },
      include: {
        units: {
          where: { isActive: true },
        },
      },
    })
  }

  // Unidades disponibles por corporación
  async getAvailableUnitsByCorporation(corporationId: string) {
    return await prisma.unit.findMany({
      where: {
        corporationId,
        isActive: true,
        status: 'DISPONIBLE',
      },
      include: {
        corporation: true,
      },
      orderBy: { economicNumber: 'asc' },
    })
  }

  // Perfiles
  async getProfiles() {
    return await prisma.profile.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  // Stats para widgets
  async getCorporationStats(corporationId: string) {
    const total = await prisma.unit.count({
      where: {
        corporationId,
        isActive: true,
      },
    })

    const available = await prisma.unit.count({
      where: {
        corporationId,
        isActive: true,
        status: 'DISPONIBLE',
      },
    })

    const enRoute = await prisma.unit.count({
      where: {
        corporationId,
        isActive: true,
        status: 'EN_CAMINO',
      },
    })

    const onSite = await prisma.unit.count({
      where: {
        corporationId,
        isActive: true,
        status: 'EN_LUGAR',
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
