import apiClient from './api'

class CatalogService {
  // Municipios
  async getMunicipalities() {
    const response = await apiClient.get('/catalogs/municipalities')
    return response.data.data
  }

  // Colonias
  async getColonies(municipalityId?: string, search?: string) {
    const response = await apiClient.get('/catalogs/colonies', {
      params: { municipalityId, search },
    })
    return response.data.data
  }

  async getColoniesByStreet(streetName: string, municipalityId: string) {
    const response = await apiClient.get('/catalogs/colonies/by-street', {
      params: { streetName, municipalityId },
    })
    return response.data.data
  }

  // Calles
  async getStreets(municipalityId?: string, search?: string) {
    const response = await apiClient.get('/catalogs/streets', {
      params: { municipalityId, search },
    })
    return response.data.data
  }

  // Tipos de Incidente
  async getIncidentTypes() {
    const response = await apiClient.get('/catalogs/incident-types')
    return response.data.data
  }

  async getIncidentTypeHierarchy() {
    const response = await apiClient.get('/catalogs/incident-types/hierarchy')
    return response.data.data
  }

  async getIncidentTypeById(id: string) {
    const response = await apiClient.get(`/catalogs/incident-types/${id}`)
    return response.data.data
  }

  // Corporaciones
  async getCorporations() {
    const response = await apiClient.get('/catalogs/corporations')
    return response.data.data
  }

  async getCorporationById(id: string) {
    const response = await apiClient.get(`/catalogs/corporations/${id}`)
    return response.data.data
  }

  async getAvailableUnits(corporationId: string) {
    const response = await apiClient.get(`/catalogs/corporations/${corporationId}/units`)
    return response.data.data
  }

  async getCorporationStats(corporationId: string) {
    const response = await apiClient.get(`/catalogs/corporations/${corporationId}/stats`)
    return response.data.data
  }

  // Perfiles
  async getProfiles() {
    const response = await apiClient.get('/catalogs/profiles')
    return response.data.data
  }
}

export default new CatalogService()
