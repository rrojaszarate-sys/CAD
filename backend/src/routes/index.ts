import { Router } from 'express'
import authRoutes from './authRoutes.js'

const router = Router()

// Montar rutas
router.use('/auth', authRoutes)

// Health check para API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'CAD API',
  })
})

export default router
