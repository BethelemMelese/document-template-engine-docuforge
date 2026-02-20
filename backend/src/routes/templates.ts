import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const templateRoutes = Router();
templateRoutes.use(authMiddleware);

const createTemplateSchema = z.object({
  name: z.string().min(1),
  content: z.string(),
  category: z.string().optional(),
  icon: z.string().optional(),
  variableDefinitions: z.record(z.object({ type: z.enum(['text', 'date', 'number']) })).optional(),
});

const updateTemplateSchema = createTemplateSchema.partial();

templateRoutes.get('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  const templates = await prisma.template.findMany({
    where: {
      userId,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { category: { contains: search } },
        ],
      }),
    },
    orderBy: { updatedAt: 'desc' },
  });

  const parsed = templates.map((t) => ({
    id: t.id,
    name: t.name,
    content: t.content,
    category: t.category ?? undefined,
    icon: t.icon ?? undefined,
    views: t.views,
    variableDefinitions: t.variableDefinitions ? JSON.parse(t.variableDefinitions) : undefined,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  res.json(parsed);
});

templateRoutes.get('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const id = req.params.id;
  const template = await prisma.template.findFirst({
    where: { id, userId },
  });
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  res.json({
    id: template.id,
    name: template.name,
    content: template.content,
    category: template.category ?? undefined,
    icon: template.icon ?? undefined,
    views: template.views,
    variableDefinitions: template.variableDefinitions ? JSON.parse(template.variableDefinitions) : undefined,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  });
});

templateRoutes.post('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const parsed = createTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const { name, content, category, icon, variableDefinitions } = parsed.data;

  const template = await prisma.template.create({
    data: {
      userId,
      name,
      content,
      category: category ?? null,
      icon: icon ?? null,
      variableDefinitions: variableDefinitions ? JSON.stringify(variableDefinitions) : null,
    },
  });

  res.status(201).json({
    id: template.id,
    name: template.name,
    content: template.content,
    category: template.category ?? undefined,
    icon: template.icon ?? undefined,
    views: template.views,
    variableDefinitions: template.variableDefinitions ? JSON.parse(template.variableDefinitions) : undefined,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  });
});

templateRoutes.patch('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const id = req.params.id;
  const parsed = updateTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.template.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.content !== undefined) updateData.content = parsed.data.content;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category ?? null;
  if (parsed.data.icon !== undefined) updateData.icon = parsed.data.icon ?? null;
  if (parsed.data.variableDefinitions !== undefined) {
    updateData.variableDefinitions = JSON.stringify(parsed.data.variableDefinitions);
  }

  const template = await prisma.template.update({
    where: { id },
    data: updateData,
  });

  res.json({
    id: template.id,
    name: template.name,
    content: template.content,
    category: template.category ?? undefined,
    icon: template.icon ?? undefined,
    views: template.views,
    variableDefinitions: template.variableDefinitions ? JSON.parse(template.variableDefinitions) : undefined,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  });
});

templateRoutes.put('/:id/increment-views', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const id = req.params.id;
  const existing = await prisma.template.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  const template = await prisma.template.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
  res.json({ views: template.views });
});

templateRoutes.delete('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const id = req.params.id;
  const existing = await prisma.template.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  await prisma.template.delete({ where: { id } });
  res.status(204).send();
});
