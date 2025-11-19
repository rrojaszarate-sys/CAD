import { Request, Response } from 'express'
import userService from '../services/userService.js'

export class UserController {
  // GET /api/users
  async getAllUsers(req: Request, res: Response) {
    try {
      const filters = {
        perfilId: req.query.perfilId as string,
        estaActivo: req.query.estaActivo === 'true' ? true : req.query.estaActivo === 'false' ? false : undefined,
        search: req.query.search as string,
      }

      const users = await userService.getAllUsers(filters)

      res.json({
        success: true,
        data: users,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener usuarios',
      })
    }
  }

  // GET /api/users/:id
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await userService.getUserById(id)

      res.json({
        success: true,
        data: user,
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al obtener usuario',
      })
    }
  }

  // POST /api/users
  async createUser(req: Request, res: Response) {
    try {
      const createdBy = req.user?.userId || ''
      const user = await userService.createUser(req.body, createdBy)

      res.status(201).json({
        success: true,
        data: user,
        message: 'Usuario creado exitosamente',
      })
    } catch (error: any) {
      const status = error.message.includes('ya existe') || error.message.includes('ya está registrado') ? 400 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al crear usuario',
      })
    }
  }

  // PUT /api/users/:id
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const updatedBy = req.user?.userId || ''
      const user = await userService.updateUser(id, req.body, updatedBy)

      res.json({
        success: true,
        data: user,
        message: 'Usuario actualizado exitosamente',
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : error.message.includes('ya está registrado') ? 400 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al actualizar usuario',
      })
    }
  }

  // POST /api/users/:id/change-password
  async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params
      await userService.changePassword(id, req.body)

      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : error.message === 'La contraseña actual es incorrecta' ? 400 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al cambiar contraseña',
      })
    }
  }

  // POST /api/users/:id/reset-password
  async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { nuevaContrasena } = req.body
      const resetBy = req.user?.userId || ''

      if (!nuevaContrasena) {
        return res.status(400).json({
          success: false,
          error: 'La nueva contraseña es requerida',
        })
      }

      await userService.resetPassword(id, nuevaContrasena, resetBy)

      res.json({
        success: true,
        message: 'Contraseña reseteada exitosamente',
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al resetear contraseña',
      })
    }
  }

  // POST /api/users/:id/unlock
  async unlockUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const unlockedBy = req.user?.userId || ''
      await userService.unlockUser(id, unlockedBy)

      res.json({
        success: true,
        message: 'Usuario desbloqueado exitosamente',
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al desbloquear usuario',
      })
    }
  }

  // POST /api/users/:id/toggle-status
  async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const toggledBy = req.user?.userId || ''
      const result = await userService.toggleUserStatus(id, toggledBy)

      res.json({
        success: true,
        data: result,
        message: result.estaActivo ? 'Usuario activado exitosamente' : 'Usuario desactivado exitosamente',
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al cambiar estado del usuario',
      })
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const deletedBy = req.user?.userId || ''
      await userService.deleteUser(id, deletedBy)

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
      })
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : 500
      res.status(status).json({
        success: false,
        error: error.message || 'Error al eliminar usuario',
      })
    }
  }
}

export default new UserController()
