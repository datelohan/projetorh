import { Router } from 'express';
import { funcionariosRouter } from './funcionarios.routes';
import { usuariosRouter } from './usuarios.routes';

const routes = Router();

routes.use('/usuarios', usuariosRouter);
routes.use('/funcionarios', funcionariosRouter);

export { routes };
