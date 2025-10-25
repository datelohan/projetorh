"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const funcionarios_routes_1 = require("./funcionarios.routes");
const usuarios_routes_1 = require("./usuarios.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use('/auth', auth_routes_1.authRouter);
routes.use('/usuarios', usuarios_routes_1.usuariosRouter);
routes.use('/funcionarios', funcionarios_routes_1.funcionariosRouter);
//# sourceMappingURL=index.js.map