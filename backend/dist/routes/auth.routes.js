"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const user_1 = require("../utils/user");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', async (request, response, next) => {
    try {
        const { email, senha } = request.body;
        if (!email || !senha) {
            return response.status(400).json({ message: 'Informe email e senha.' });
        }
        const usuario = await prisma_1.prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !usuario.senhaHash) {
            return response.status(401).json({ message: 'Credenciais invalidas.' });
        }
        if (!usuario.ativo) {
            return response.status(403).json({ message: 'Usuario inativo.' });
        }
        const senhaConfere = await (0, password_1.comparePassword)(senha, usuario.senhaHash);
        if (!senhaConfere) {
            return response.status(401).json({ message: 'Credenciais invalidas.' });
        }
        const token = (0, jwt_1.signToken)(usuario.id);
        return response.json({
            token,
            user: (0, user_1.toPublicUser)(usuario),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.post('/register', ensureAuthenticated_1.ensureAuthenticated, async (request, response, next) => {
    try {
        const { nome, email, senha, role, ativo = true } = request.body;
        if (!nome || !email || !senha || !role) {
            return response.status(400).json({ message: 'Campos obrigatorios: nome, email, senha e role.' });
        }
        const jaExiste = await prisma_1.prisma.usuario.findUnique({ where: { email } });
        if (jaExiste) {
            return response.status(409).json({ message: 'Email ja cadastrado.' });
        }
        const senhaHash = await (0, password_1.hashPassword)(senha);
        const usuario = await prisma_1.prisma.usuario.create({
            data: {
                nome,
                email,
                senhaHash,
                role,
                ativo,
            },
        });
        const token = (0, jwt_1.signToken)(usuario.id);
        return response.status(201).json({
            token,
            user: (0, user_1.toPublicUser)(usuario),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.authRouter.get('/me', ensureAuthenticated_1.ensureAuthenticated, async (request, response, next) => {
    try {
        if (!request.userId) {
            return response.status(401).json({ message: 'Nao autorizado.' });
        }
        const usuario = await prisma_1.prisma.usuario.findUnique({
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
        });
        if (!usuario) {
            return response.status(404).json({ message: 'Usuario nao encontrado.' });
        }
        return response.json((0, user_1.toPublicUser)(usuario));
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=auth.routes.js.map