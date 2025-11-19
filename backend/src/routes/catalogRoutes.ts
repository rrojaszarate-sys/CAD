import { Router } from 'express'
import catalogController from '../controllers/catalogController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticate)

// Municipios
router.get('/municipalities', catalogController.getMunicipalities)

// Colonias
router.get('/colonies', catalogController.getColonies)
router.get('/colonies/by-street', catalogController.getColoniesByStreet)

// Calles
router.get('/streets', catalogController.getStreets)

// Tipos de Incidente
router.get('/incident-types', catalogController.getIncidentTypes)
router.get('/incident-types/hierarchy', catalogController.getIncidentTypeHierarchy)
router.get('/incident-types/:id', catalogController.getIncidentTypeById)

// Corporaciones
router.get('/corporations', catalogController.getCorporations)
router.get('/corporations/:id', catalogController.getCorporationById)
router.get('/corporations/:corporationId/units', catalogController.getAvailableUnits)
router.get('/corporations/:corporationId/stats', catalogController.getCorporationStats)

// Perfiles
router.get('/profiles', catalogController.getProfiles)

export default router
