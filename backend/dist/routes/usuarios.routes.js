"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuariosRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const password_1 = require("../utils/password");
const user_1 = require("../utils/user");
exports.usuariosRouter = (0, express_1.Router)();
exports.usuariosRouter.use(ensureAuthenticated_1.ensureAuthenticated);
exports.usuariosRouter.get('/', async (_req, res, next) => {
    try {
        const usuarios = await prisma_1.prisma.usuario.findMany({
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
        res.json(usuarios.map((usuario) => (0, user_1.toPublicUser)(usuario)));
    }
    catch (error) {
        next(error);
    }
});
exports.usuariosRouter.post('/', async (req, res, next) => {
    try {
        const { nome, email, senha, role, ativo } = req.body;
        if (!nome || !email || !senha || !role) {
            return res.status(400).json({
                message: 'Campos obrigatorios: nome, email, senha, role.',
            });
        }
        if (!Object.values(client_1.Role).includes(role)) {
            return res.status(400).json({
                message: `Role invalida. Valores permitidos: ${Object.values(client_1.Role).join(', ')}`,
            });
        }
        const usuarioExistente = await prisma_1.prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(409).json({ message: 'Email ja cadastrado.' });
        }
        const senhaHash = await (0, password_1.hashPassword)(senha);
        const usuario = await prisma_1.prisma.usuario.create({
            data: {
                nome,
                email,
                senhaHash,
                role,
                ativo: typeof ativo === 'boolean' ? ativo : true,
            },
        });
        res.status(201).json((0, user_1.toPublicUser)(usuario));
    }
    catch (error) {
        next(error);
    }
});
exports.usuariosRouter.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, email, role, ativo, senha } = req.body;
        if (!nome || !email || !role) {
            return res.status(400).json({
                message: 'Campos obrigatorios: nome, email, role.',
            });
        }
        if (!Object.values(client_1.Role).includes(role)) {
            return res.status(400).json({
                message: `Role invalida. Valores permitidos: ${Object.values(client_1.Role).join(', ')}`,
            });
        }
        const dataToUpdate = {
            nome,
            email,
            role,
        };
        if (typeof ativo === 'boolean') {
            dataToUpdate.ativo = ativo;
        }
        if (senha) {
            dataToUpdate.senhaHash = await (0, password_1.hashPassword)(senha);
        }
        const usuario = await prisma_1.prisma.usuario.update({
            where: { id },
            data: dataToUpdate,
        });
        res.json((0, user_1.toPublicUser)(usuario));
    }
    catch (error) {
        next(error);
    }
});
exports.usuariosRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.usuario.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=usuarios.routes.js.map