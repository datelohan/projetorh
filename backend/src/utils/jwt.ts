import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/auth'

export function signToken(userId: string) {
  return jwt.sign({}, jwtConfig.secret, {
    subject: userId,
    expiresIn: jwtConfig.expiresIn,
  })
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtConfig.secret)
}

export type JwtPayload = jwt.JwtPayload | string
