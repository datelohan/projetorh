import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: 'Token nao informado.' })
  }

  const [scheme, token] = authHeader.split(' ')

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return response.status(401).json({ message: 'Token invalido.' })
  }

  try {
    const payload = verifyToken(token)

    const subject = typeof payload === 'string' ? payload : payload.sub

    if (!subject) {
      return response.status(401).json({ message: 'Token invalido.' })
    }

    request.userId = subject

    return next()
  } catch (error) {
    return response.status(401).json({ message: 'Nao autorizado.' })
  }
}
