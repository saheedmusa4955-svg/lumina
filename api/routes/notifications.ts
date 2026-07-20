import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all notifications for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to 20 most recent
    });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a specific notification as read
router.post('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    
    // Ensure it belongs to the user
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    res.json({ notification: updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all as read
router.post('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
