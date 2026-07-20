import { Router } from 'express';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// --- Profile Updates ---
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName } = req.body;
    const fullName = `${firstName} ${lastName}`.trim();
    
    if (!fullName) return res.status(400).json({ error: 'Name cannot be empty' });

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { fullName },
      select: { id: true, email: true, fullName: true, role: true, balance: true, accountNumber: true, accountStatus: true, isTwoFactorEnabled: true }
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Password Change ---
router.post('/password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords are required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters long' });

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Incorrect current password' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    // Also revoke all other devices when password changes for security
    await prisma.device.deleteMany({
      where: { userId: user.id }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Two-Factor Authentication (2FA) ---
router.post('/2fa/generate', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.isTwoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `Lumina Bank (${user.email})`
    });

    // Save secret temporarily in user profile (we'll verify it before officially enabling)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret.base32 }
    });

    // Generate QR Code URL
    QRCode.toDataURL(secret.otpauth_url!, (err, data_url) => {
      if (err) return res.status(500).json({ error: 'Error generating QR code' });
      res.json({ secret: secret.base32, qrCode: data_url });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/2fa/verify', authenticate, async (req: AuthRequest, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Verification code is required' });

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user || !user.twoFactorSecret) return res.status(400).json({ error: '2FA secret not found. Please generate first.' });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1 // allows 30 seconds before and after current time
    });

    if (verified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isTwoFactorEnabled: true }
      });
      res.json({ message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/2fa/disable', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Incorrect password' });

    await prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: false, twoFactorSecret: null }
    });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Device/Session Management ---
router.get('/devices', authenticate, async (req: AuthRequest, res) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user!.id },
      orderBy: { lastActive: 'desc' }
    });
    res.json({ devices });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/devices/:id/revoke', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    
    // Ensure the device belongs to the user
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device || device.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Device not found' });
    }

    await prisma.device.delete({ where: { id } });
    res.json({ message: 'Device revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
