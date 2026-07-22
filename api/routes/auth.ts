import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UAParser } from 'ua-parser-js';
import speakeasy from 'speakeasy';
import prisma from '../db';
import { sendEmail, templates } from '../utils/mailer';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const getCurrencyFromCountry = (country: string) => {
  const map: Record<string, string> = {
    'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'EU': 'EUR',
    'JP': 'JPY', 'NG': 'NGN', 'ZA': 'ZAR', 'BR': 'BRL', 'IN': 'INR',
    'CN': 'CNY', 'MX': 'MXN', 'RU': 'RUB', 'KR': 'KRW', 'TR': 'TRY',
    'SE': 'SEK'
  };
  return map[country] || 'USD';
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, country } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // First user becomes admin automatically for testing purposes
    const count = await prisma.user.count();
    const role = count === 0 ? 'ADMIN' : 'USER';

    // Generate 8-digit unique account number
    let accountNumber = '';
    let isUnique = false;
    while (!isUnique) {
      accountNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
      const exists = await prisma.user.findUnique({ where: { accountNumber } });
      if (!exists) isUnique = true;
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        accountNumber,
        country,
        role,
      }
    });

    const primaryCurrency = getCurrencyFromCountry(country);
    const initialCurrencies = Array.from(new Set([primaryCurrency, 'USD', 'EUR', 'GBP', 'NGN']));

    await Promise.all(initialCurrencies.map(currency => 
      prisma.wallet.create({
        data: {
          userId: user.id,
          currency,
          balance: 0.0
        }
      })
    ));

    const finalUser = await prisma.user.findUnique({ where: { id: user.id }, include: { wallets: true } });

    // Create a welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Lumina Bank!',
        message: 'Your account has been successfully created. Please complete your KYC verification.'
      }
    });

    // Send Welcome Email
    await sendEmail(user.email, 'Welcome to Lumina Bank', templates.welcome(user.fullName));

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, wallets: finalUser!.wallets, accountNumber: user.accountNumber, accountStatus: user.accountStatus, country: user.country } });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check 2FA if enabled
    if (user.isTwoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(403).json({ requiresTwoFactor: true });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1
      });

      if (!verified) {
        return res.status(401).json({ error: 'Invalid 2FA code' });
      }
    }

    // Record Device/Session
    const userAgentString = req.headers['user-agent'] || 'Unknown Device';
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();
    const browser = result.browser.name ? `${result.browser.name} ${result.browser.version}` : 'Unknown Browser';
    const os = result.os.name ? `${result.os.name} ${result.os.version}` : 'Unknown OS';
    const friendlyAgent = `${browser} on ${os}`;

    await prisma.device.create({
      data: {
        userId: user.id,
        userAgent: friendlyAgent,
        ipAddress: req.ip || req.socket.remoteAddress || 'Unknown IP'
      }
    });

    const finalUser = await prisma.user.findUnique({ where: { id: user.id }, include: { wallets: true } });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, wallets: finalUser!.wallets, kycStatus: user.kycStatus, accountNumber: user.accountNumber, accountStatus: user.accountStatus, isTwoFactorEnabled: user.isTwoFactorEnabled, country: user.country } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user?.id },
      select: { id: true, email: true, fullName: true, role: true, wallets: true, kycStatus: true, accountNumber: true, accountStatus: true, isTwoFactorEnabled: true, country: true }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ user });
  } catch (error) {
    console.error('/me Route Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
