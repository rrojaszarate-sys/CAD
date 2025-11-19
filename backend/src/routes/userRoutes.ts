import { Router } from 'express'
import userController from '../controllers/userController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticate)

// GET /api/users - Listar usuarios (todos los perfiles autenticados)
router.get('/', userController.getAllUsers)

// GET /api/users/:id - Obtener usuario por ID (todos los perfiles autenticados)
router.get('/:id', userController.getUserById)

// POST /api/users - Crear usuario (solo Administrador)
router.post('/', authorize('Administrador'), userController.createUser)

// PUT /api/users/:id - Actualizar usuario (solo Administrador)
router.put('/:id', authorize('Administrador'), userController.updateUser)

// POST /api/users/:id/change-password - Cambiar contraseña (usuario mismo o administrador)
router.post('/:id/change-password', userController.changePassword)

// POST /api/users/:id/reset-password - Resetear contraseña (solo Administrador)
router.post('/:id/reset-password', authorize('Administrador'), userController.resetPassword)

// POST /api/users/:id/unlock - Desbloquear usuario (solo Administrador o Supervisor)
router.post('/:id/unlock', authorize('Administrador', 'Supervisor'), userController.unlockUser)

// POST /api/users/:id/toggle-status - Activar/Desactivar usuario (solo Administrador)
router.post('/:id/toggle-status', authorize('Administrador'), userController.toggleUserStatus)

// DELETE /api/users/:id - Eliminar usuario (solo Administrador)
router.delete('/:id', authorize('Administrador'), userController.deleteUser)

export default router
