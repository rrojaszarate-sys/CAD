import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService.js'
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.js'

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, profileId, phoneAccess, extension } = req.body

      // Validaciones básicas
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Usuario y contraseña son requeridos',
        })
      }

      const result = await authService.login({
        username,
        password,
        profileId,
        phoneAccess,
        extension,
      })

      res.json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
      })
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado',
        })
      }

      await authService.logout(userId)

      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token requerido',
        })
      }

      const payload = verifyRefreshToken(refreshToken)
      const accessToken = generateAccessToken(payload)

      res.json({
        success: true,
        data: {
          accessToken,
        },
      })
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: 'Refresh token inválido o expirado',
      })
    }
  }

  async getProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.query

      if (!username || typeof username !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Username es requerido',
        })
      }

      const profiles = await authService.getAvailableProfiles(username)

      res.json({
        success: true,
        data: profiles,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      })
    }
  }

  async validateExtension(req: Request, res: Response, next: NextFunction) {
    try {
      const { extension } = req.query

      if (!extension || typeof extension !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Extension es requerida',
        })
      }

      const isValid = await authService.validateExtension(extension)

      res.json({
        success: true,
        data: {
          valid: isValid,
        },
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado',
        })
      }

      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
        })
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profile: {
            id: user.profile.id,
            name: user.profile.name,
            permissions: user.profile.permissions,
          },
        },
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }
}

export default new AuthController()
