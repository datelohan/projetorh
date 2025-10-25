import { Router } from 'express';
import { authRouter } from './auth.routes';
import { funcionariosRouter } from './funcionarios.routes';
import { usuariosRouter } from './usuarios.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/usuarios', usuariosRouter);
routes.use('/funcionarios', funcionariosRouter);

export { routes };
