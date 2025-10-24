import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  return res.status(500).json({ message: 'Erro interno no servidor.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API rodando na porta ${port}`));
