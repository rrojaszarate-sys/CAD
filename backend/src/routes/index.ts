import { Router } from 'express'
import authRoutes from './authRoutes.js'
import catalogRoutes from './catalogRoutes.js'
import userRoutes from './userRoutes.js'

const router = Router()

// Montar rutas
router.use('/auth', authRoutes)
router.use('/catalogs', catalogRoutes)
router.use('/users', userRoutes)

// Health check para API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'CAD API',
  })
})

export default router
