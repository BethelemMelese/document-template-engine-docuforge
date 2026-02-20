import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const globalVariableRoutes = Router();
globalVariableRoutes.use(authMiddleware);

const variableTypeSchema = z.enum(['text', 'date', 'number']);

const createVariableSchema = z.object({
  name: z.string().min(1),
  type: variableTypeSchema,
});

const updateVariablesSchema = z.array(
  z.object({
    name: z.string().min(1),
    type: variableTypeSchema,
  })
);

globalVariableRoutes.get('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const vars = await prisma.globalVariable.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
  res.json(vars.map((v) => ({ name: v.name, type: v.type })));
});

globalVariableRoutes.put('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const parsed = updateVariablesSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  await prisma.globalVariable.deleteMany({ where: { userId } });

  const created = await prisma.globalVariable.createMany({
    data: parsed.data.map((v) => ({
      userId,
      name: v.name.trim().replace(/\s+/g, '_'),
      type: v.type,
    })),
    skipDuplicates: true,
  });

  const vars = await prisma.globalVariable.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
  res.json(vars.map((v) => ({ name: v.name, type: v.type })));
});

globalVariableRoutes.post('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const parsed = createVariableSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const name = parsed.data.name.trim().replace(/\s+/g, '_');

  const existing = await prisma.globalVariable.findUnique({
    where: { userId_name: { userId, name } },
  });
  if (existing) {
    res.status(409).json({ error: 'Variable already exists' });
    return;
  }

  const v = await prisma.globalVariable.create({
    data: { userId, name, type: parsed.data.type },
  });
  res.status(201).json({ name: v.name, type: v.type });
});

globalVariableRoutes.delete('/:name', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const name = decodeURIComponent(req.params.name);
  const deleted = await prisma.globalVariable.deleteMany({
    where: { userId, name },
  });
  if (deleted.count === 0) {
    res.status(404).json({ error: 'Variable not found' });
    return;
  }
  res.status(204).send();
});
