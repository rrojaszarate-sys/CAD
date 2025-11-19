import { Router } from 'express'
import authController from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// Rutas públicas
router.post('/login', authController.login)
router.post('/refresh', authController.refreshToken)
router.get('/profiles', authController.getProfiles)
router.get('/validate-extension', authController.validateExtension)

// Rutas protegidas
router.post('/logout', authenticate, authController.logout)
router.get('/me', authenticate, authController.me)

export default router
