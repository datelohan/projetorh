import { Role } from '@prisma/client'
import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { hashPassword } from '../utils/password'
import { toPublicUser } from '../utils/user'

export const usuariosRouter = Router()

usuariosRouter.use(ensureAuthenticated)

usuariosRouter.get('/', async (_req, res, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        funcionario: {
          select: {
            id: true,
            nomeCompleto: true,
            cargo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(usuarios.map((usuario) => toPublicUser(usuario)))
  } catch (error) {
    next(error)
  }
})

usuariosRouter.post('/', async (req, res, next) => {
  try {
    const { nome, email, senha, role, ativo } = req.body

    if (!nome || !email || !senha || !role) {
      return res.status(400).json({
        message: 'Campos obrigatorios: nome, email, senha, role.',
      })
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: `Role invalida. Valores permitidos: ${Object.values(Role).join(', ')}`,
      })
    }

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })

    if (usuarioExistente) {
      return res.status(409).json({ message: 'Email ja cadastrado.' })
    }

    const senhaHash = await hashPassword(senha)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role,
        ativo: typeof ativo === 'boolean' ? ativo : true,
      },
    })

    res.status(201).json(toPublicUser(usuario))
  } catch (error) {
    next(error)
  }
})

usuariosRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { nome, email, role, ativo, senha } = req.body

    if (!nome || !email || !role) {
      return res.status(400).json({
        message: 'Campos obrigatorios: nome, email, role.',
      })
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: `Role invalida. Valores permitidos: ${Object.values(Role).join(', ')}`,
      })
    }

    const dataToUpdate: {
      nome: string
      email: string
      role: Role
      ativo?: boolean
      senhaHash?: string
    } = {
      nome,
      email,
      role,
    }

    if (typeof ativo === 'boolean') {
      dataToUpdate.ativo = ativo
    }

    if (senha) {
      dataToUpdate.senhaHash = await hashPassword(senha)
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
    })

    res.json(toPublicUser(usuario))
  } catch (error) {
    next(error)
  }
})

usuariosRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.usuario.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
