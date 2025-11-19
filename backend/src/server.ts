import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import apiRoutes from './routes/index.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const httpServer = createServer(app)

// Configurar Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})

// Middleware de seguridad
app.use(helmet())

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
)

// Compression
app.use(compression())

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API Routes
app.use('/api', apiRoutes)

// Socket.IO eventos (TODO: Implementar)
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`)
  })
})

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err)
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  }
)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  })
})

// Iniciar servidor
const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || 'localhost'

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         SISTEMA CAD - BACKEND SERVER                  ║
╠════════════════════════════════════════════════════════╣
║  🚀 Servidor iniciado correctamente                   ║
║  📡 URL: http://${HOST}:${PORT}                   ║
║  🌐 Entorno: ${process.env.NODE_ENV || 'development'}  ║
║  ⏰ Timestamp: ${new Date().toLocaleString()}          ║
╚════════════════════════════════════════════════════════╝
  `)
})

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('✅ HTTP server closed')
    process.exit(0)
  })
})

export { app, io }
