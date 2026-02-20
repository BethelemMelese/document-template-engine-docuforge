import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.js';
import { templateRoutes } from './routes/templates.js';
import { applicationRoutes } from './routes/applications.js';
import { globalVariableRoutes } from './routes/globalVariables.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/global-variables', globalVariableRoutes);

app.listen(PORT, () => {
  console.log(`LetterForge API running at http://localhost:${PORT}`);
});
