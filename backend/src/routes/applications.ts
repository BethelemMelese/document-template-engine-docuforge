import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const applicationRoutes = Router();
applicationRoutes.use(authMiddleware);

const createApplicationSchema = z.object({
  templateId: z.string().uuid(),
  company: z.string(),
  position: z.string(),
  date: z.string(),
  email: z.string().optional(),
  mergedContent: z.string(),
});

applicationRoutes.get('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { template: { select: { id: true, name: true } } },
  });

  res.json(
    applications.map((a) => ({
      id: a.id,
      templateId: a.templateId,
      templateName: a.template.name,
      company: a.company,
      position: a.position,
      date: a.date,
      email: a.email ?? undefined,
      mergedContent: a.mergedContent,
      createdAt: a.createdAt.toISOString(),
    }))
  );
});

applicationRoutes.post('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const parsed = createApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const template = await prisma.template.findFirst({
    where: { id: parsed.data.templateId, userId },
  });
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }

  const application = await prisma.application.create({
    data: {
      userId,
      templateId: parsed.data.templateId,
      company: parsed.data.company,
      position: parsed.data.position,
      date: parsed.data.date,
      email: parsed.data.email ?? null,
      mergedContent: parsed.data.mergedContent,
    },
    include: { template: { select: { name: true } } },
  });

  res.status(201).json({
    id: application.id,
    templateId: application.templateId,
    templateName: application.template.name,
    company: application.company,
    position: application.position,
    date: application.date,
    email: application.email ?? undefined,
    mergedContent: application.mergedContent,
    createdAt: application.createdAt.toISOString(),
  });
});
