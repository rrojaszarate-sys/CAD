import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js'

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      })
    }

    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      })
    }

    const payload = verifyAccessToken(token)
    req.user = payload

    next()
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    })
  }
}

export function authorize(...allowedProfiles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado',
      })
    }

    if (allowedProfiles.length === 0) {
      return next()
    }

    if (allowedProfiles.includes(req.user.profileName)) {
      return next()
    }

    res.status(403).json({
      success: false,
      error: 'No tiene permisos para realizar esta acción',
    })
  }
}
