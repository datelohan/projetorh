"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funcionariosRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const password_1 = require("../utils/password");
exports.funcionariosRouter = (0, express_1.Router)();
exports.funcionariosRouter.use(ensureAuthenticated_1.ensureAuthenticated);
exports.funcionariosRouter.get('/', async (_req, res, next) => {
    try {
        const funcionarios = await prisma_1.prisma.funcionario.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true,
                        ativo: true,
                    },
                },
                gestor: {
                    select: {
                        id: true,
                        nomeCompleto: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(funcionarios);
    }
    catch (error) {
        next(error);
    }
});
exports.funcionariosRouter.post('/', async (req, res, next) => {
    try {
        const { nomeCompleto, cpf, cargo, departamento, dataAdmissao, gestorId, salarioBase, usuario, } = req.body;
        if (!nomeCompleto || !cpf || !cargo || !dataAdmissao) {
            return res.status(400).json({
                message: 'Campos obrigatorios: nomeCompleto, cpf, cargo, dataAdmissao.',
            });
        }
        let usuarioNovo;
        if (usuario) {
            if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.role) {
                return res.status(400).json({
                    message: 'Para criar o usuario vinculado informe nome, email, senha e role.',
                });
            }
            usuarioNovo = {
                create: {
                    nome: usuario.nome,
                    email: usuario.email,
                    senhaHash: await (0, password_1.hashPassword)(usuario.senha),
                    role: usuario.role,
                    ativo: usuario.ativo ?? true,
                },
            };
        }
        const funcionario = await prisma_1.prisma.funcionario.create({
            data: {
                nomeCompleto,
                cpf,
                cargo,
                departamento,
                dataAdmissao: new Date(dataAdmissao),
                gestor: gestorId ? { connect: { id: gestorId } } : undefined,
                salarioBase,
                usuario: usuarioNovo,
            },
            include: {
                usuario: true,
                gestor: true,
            },
        });
        res.status(201).json(funcionario);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({
                message: 'CPF ou email ja cadastrado.',
            });
        }
        next(error);
    }
});
//# sourceMappingURL=funcionarios.routes.js.map