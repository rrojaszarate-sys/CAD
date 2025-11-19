import { Request, Response, NextFunction } from 'express'
import catalogService from '../services/catalogService.js'

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
}

export default new CatalogController()
