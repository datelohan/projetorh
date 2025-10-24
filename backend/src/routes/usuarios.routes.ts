import { Role } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const usuariosRouter = Router();

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
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

usuariosRouter.post('/', async (req, res, next) => {
  try {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha || !role) {
      return res.status(400).json({
        message: 'Campos obrigatórios: nome, email, senha, role.',
      });
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: `Role inválida. Valores permitidos: ${Object.values(Role).join(', ')}`,
      });
    }

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash: senha,
        role,
      },
    });

    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
});
