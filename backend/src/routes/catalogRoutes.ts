import { Router } from 'express'
import catalogController from '../controllers/catalogController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticate)

// ============================================
// MUNICIPIOS
// ============================================
router.get('/municipalities', catalogController.getMunicipalities)
router.post('/municipalities', authorize('Administrador'), catalogController.createMunicipality)
router.put('/municipalities/:id', authorize('Administrador'), catalogController.updateMunicipality)
router.delete('/municipalities/:id', authorize('Administrador'), catalogController.deleteMunicipality)

// ============================================
// COLONIAS
// ============================================
router.get('/colonies', catalogController.getColonies)
router.get('/colonies/by-street', catalogController.getColoniesByStreet)
router.post('/colonies', authorize('Administrador'), catalogController.createColony)
router.put('/colonies/:id', authorize('Administrador'), catalogController.updateColony)
router.delete('/colonies/:id', authorize('Administrador'), catalogController.deleteColony)

// ============================================
// CALLES
// ============================================
router.get('/streets', catalogController.getStreets)
router.post('/streets', authorize('Administrador'), catalogController.createStreet)
router.put('/streets/:id', authorize('Administrador'), catalogController.updateStreet)
router.delete('/streets/:id', authorize('Administrador'), catalogController.deleteStreet)

// ============================================
// TIPOS DE INCIDENTE
// ============================================
router.get('/incident-types', catalogController.getIncidentTypes)
router.get('/incident-types/hierarchy', catalogController.getIncidentTypeHierarchy)
router.get('/incident-types/:id', catalogController.getIncidentTypeById)
router.post('/incident-types', authorize('Administrador'), catalogController.createIncidentType)
router.put('/incident-types/:id', authorize('Administrador'), catalogController.updateIncidentType)
router.delete('/incident-types/:id', authorize('Administrador'), catalogController.deleteIncidentType)

// ============================================
// CORPORACIONES
// ============================================
router.get('/corporations', catalogController.getCorporations)
router.get('/corporations/:id', catalogController.getCorporationById)
router.get('/corporations/:corporationId/units', catalogController.getAvailableUnits)
router.get('/corporations/:corporationId/stats', catalogController.getCorporationStats)
router.post('/corporations', authorize('Administrador'), catalogController.createCorporation)
router.put('/corporations/:id', authorize('Administrador'), catalogController.updateCorporation)
router.delete('/corporations/:id', authorize('Administrador'), catalogController.deleteCorporation)

// ============================================
// UNIDADES
// ============================================
router.get('/units', catalogController.getUnits)
router.post('/units', authorize('Administrador'), catalogController.createUnit)
router.put('/units/:id', authorize('Administrador'), catalogController.updateUnit)
router.delete('/units/:id', authorize('Administrador'), catalogController.deleteUnit)

// ============================================
// PERFILES
// ============================================
router.get('/profiles', catalogController.getProfiles)
router.post('/profiles', authorize('Administrador'), catalogController.createProfile)
router.put('/profiles/:id', authorize('Administrador'), catalogController.updateProfile)
router.delete('/profiles/:id', authorize('Administrador'), catalogController.deleteProfile)

export default router
