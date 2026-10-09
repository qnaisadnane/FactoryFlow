import express from 'express';
import errormiddleware from './middlewares/errorMiddleware.js';
import installationRoutes from './routes/installationRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/installation', installationRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FactoryFlow fonctionne' });
});

app.use((req, res, next) => {
  const error = new Error(`Route introuvable : ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errormiddleware);

export default app;