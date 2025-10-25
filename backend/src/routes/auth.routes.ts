import { Role } from '@prisma/client'
import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { comparePassword, hashPassword } from '../utils/password'
import { signToken } from '../utils/jwt'
import { toPublicUser } from '../utils/user'

export const authRouter = Router()

authRouter.post('/login', async (request, response, next) => {
  try {
    const { email, senha } = request.body

    if (!email || !senha) {
      return response.status(400).json({ message: 'Informe email e senha.' })
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !usuario.senhaHash) {
      return response.status(401).json({ message: 'Credenciais invalidas.' })
    }

    if (!usuario.ativo) {
      return response.status(403).json({ message: 'Usuario inativo.' })
    }

    const senhaConfere = await comparePassword(senha, usuario.senhaHash)

    if (!senhaConfere) {
      return response.status(401).json({ message: 'Credenciais invalidas.' })
    }

    const token = signToken(usuario.id)

    return response.json({
      token,
      user: toPublicUser(usuario),
    })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/register', async (request, response, next) => {
  try {
    const { nome, email, senha, role, ativo = true } = request.body

    if (!nome || !email || !senha) {
      return response.status(400).json({ message: 'Campos obrigatorios: nome, email e senha.' })
    }

    const jaExiste = await prisma.usuario.findUnique({ where: { email } })

    if (jaExiste) {
      return response.status(409).json({ message: 'Email ja cadastrado.' })
    }

    const allowedRoles = Object.values(Role) as string[]
    const roleValue: Role = typeof role === 'string' && allowedRoles.includes(role)
      ? (role as Role)
      : Role.FUNCIONARIO

    const senhaHash = await hashPassword(senha)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role: roleValue,
        ativo,
      },
    })

    const token = signToken(usuario.id)

    return response.status(201).json({
      token,
      user: toPublicUser(usuario),
    })
  } catch (error) {
    next(error)
  }
})

authRouter.get('/me', ensureAuthenticated, async (request, response, next) => {
  try {
    if (!request.userId) {
      return response.status(401).json({ message: 'Nao autorizado.' })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: request.userId },
      include: {
        funcionario: {
          select: {
            id: true,
            nomeCompleto: true,
            cargo: true,
          },
        },
      },
    })

    if (!usuario) {
      return response.status(404).json({ message: 'Usuario nao encontrado.' })
    }

    return response.json(toPublicUser(usuario))
  } catch (error) {
    next(error)
  }
})
