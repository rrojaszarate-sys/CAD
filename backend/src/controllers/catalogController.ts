import { Request, Response, NextFunction } from 'express'
import catalogService from '../services/catalogService.js'
import profileService from '../services/profileService.js'
import municipalityService from '../services/municipalityService.js'
import colonyService from '../services/colonyService.js'
import streetService from '../services/streetService.js'
import corporationService from '../services/corporationService.js'
import unitService from '../services/unitService.js'
import incidentTypeService from '../services/incidentTypeService.js'

export class CatalogController {
  // Municipios
  async getMunicipalities(req: Request, res: Response, next: NextFunction) {
    try {
      const municipalities = await catalogService.getMunicipalities()
      res.json({ success: true, data: municipalities })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Colonias
  async getColonies(req: Request, res: Response, next: NextFunction) {
    try {
      const { municipalityId, search } = req.query

      const colonies = await catalogService.getColonies(
        municipalityId as string,
        search as string
      )

      res.json({ success: true, data: colonies })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async getColoniesByStreet(req: Request, res: Response, next: NextFunction) {
    try {
      const { streetName, municipalityId } = req.query

      if (!streetName || !municipalityId) {
        return res.status(400).json({
          success: false,
          error: 'streetName y municipalityId son requeridos',
        })
      }

      const colonies = await catalogService.getColoniesByStreet(
        streetName as string,
        municipalityId as string
      )

      res.json({ success: true, data: colonies })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Calles
  async getStreets(req: Request, res: Response, next: NextFunction) {
    try {
      const { municipalityId, search } = req.query

      const streets = await catalogService.getStreets(
        municipalityId as string,
        search as string
      )

      res.json({ success: true, data: streets })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Tipos de Incidente
  async getIncidentTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await catalogService.getIncidentTypes()
      res.json({ success: true, data: types })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async getIncidentTypeHierarchy(req: Request, res: Response, next: NextFunction) {
    try {
      const hierarchy = await catalogService.getIncidentTypeHierarchy()
      res.json({ success: true, data: hierarchy })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async getIncidentTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const type = await catalogService.getIncidentTypeById(id)

      if (!type) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de incidente no encontrado',
        })
      }

      res.json({ success: true, data: type })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Corporaciones
  async getCorporations(req: Request, res: Response, next: NextFunction) {
    try {
      const corporations = await catalogService.getCorporations()
      res.json({ success: true, data: corporations })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async getCorporationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const corporation = await catalogService.getCorporationById(id)

      if (!corporation) {
        return res.status(404).json({
          success: false,
          error: 'Corporación no encontrada',
        })
      }

      res.json({ success: true, data: corporation })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async getAvailableUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const { corporationId } = req.params
      const units = await catalogService.getAvailableUnitsByCorporation(corporationId)

      res.json({ success: true, data: units })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async getCorporationStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { corporationId } = req.params
      const stats = await catalogService.getCorporationStats(corporationId)

      res.json({ success: true, data: stats })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Perfiles
  async getProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const profiles = await catalogService.getProfiles()
      res.json({ success: true, data: profiles })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  // Municipios CRUD
  async createMunicipality(req: Request, res: Response) {
    try {
      const municipality = await municipalityService.create(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: municipality })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateMunicipality(req: Request, res: Response) {
    try {
      const municipality = await municipalityService.update(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: municipality })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteMunicipality(req: Request, res: Response) {
    try {
      await municipalityService.delete(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Municipio eliminado' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Colonias CRUD
  async createColony(req: Request, res: Response) {
    try {
      const colony = await colonyService.create(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: colony })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateColony(req: Request, res: Response) {
    try {
      const colony = await colonyService.update(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: colony })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteColony(req: Request, res: Response) {
    try {
      await colonyService.delete(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Colonia eliminada' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Calles CRUD
  async createStreet(req: Request, res: Response) {
    try {
      const street = await streetService.create(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: street })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateStreet(req: Request, res: Response) {
    try {
      const street = await streetService.update(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: street })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteStreet(req: Request, res: Response) {
    try {
      await streetService.delete(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Calle eliminada' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Tipos de Incidente CRUD
  async createIncidentType(req: Request, res: Response) {
    try {
      const type = await incidentTypeService.create(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: type })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateIncidentType(req: Request, res: Response) {
    try {
      const type = await incidentTypeService.update(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: type })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteIncidentType(req: Request, res: Response) {
    try {
      await incidentTypeService.delete(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Tipo de incidente eliminado' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Corporaciones CRUD
  async createCorporation(req: Request, res: Response) {
    try {
      const corporation = await corporationService.create(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: corporation })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateCorporation(req: Request, res: Response) {
    try {
      const corporation = await corporationService.update(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: corporation })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteCorporation(req: Request, res: Response) {
    try {
      await corporationService.delete(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Corporación eliminada' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Unidades CRUD
  async getUnits(req: Request, res: Response) {
    try {
      const { corporationId, estatus } = req.query
      const units = await unitService.getAll(corporationId as string, estatus as string)
      res.json({ success: true, data: units })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async createUnit(req: Request, res: Response) {
    try {
      const unit = await unitService.create(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: unit })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateUnit(req: Request, res: Response) {
    try {
      const unit = await unitService.update(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: unit })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteUnit(req: Request, res: Response) {
    try {
      await unitService.delete(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Unidad eliminada' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Perfiles CRUD
  async createProfile(req: Request, res: Response) {
    try {
      const profile = await profileService.createProfile(req.body, req.user?.userId || '')
      res.status(201).json({ success: true, data: profile })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const profile = await profileService.updateProfile(req.params.id, req.body, req.user?.userId || '')
      res.json({ success: true, data: profile })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  async deleteProfile(req: Request, res: Response) {
    try {
      await profileService.deleteProfile(req.params.id, req.user?.userId || '')
      res.json({ success: true, message: 'Perfil eliminado' })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

export default new CatalogController()
