import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendEmail, templates } from '../utils/mailer';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';

const router = Router();

router.get('/lookup/:accountNumber', authenticate, async (req: AuthRequest, res) => {
  try {
    const accountNumber = req.params.accountNumber as string;
    const user = await prisma.user.findUnique({
      where: { accountNumber }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    // Only return the name to prevent leaking data
    res.json({ name: user.fullName });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/transfer', authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, destination, password, twoFactorCode, currency = 'USD' } = req.body;
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const senderWallet = await prisma.wallet.findUnique({ where: { userId_currency: { userId, currency } } });
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds in selected currency' });
    }

    // Security Verification
    if (user.isTwoFactorEnabled) {
      if (!twoFactorCode) return res.status(400).json({ error: '2FA code is required' });
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1
      });
      if (!isValid) return res.status(401).json({ error: 'Invalid 2FA code' });
    } else {
      if (!password) return res.status(400).json({ error: 'Password is required to confirm transfer' });
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
    }

    // Lookup recipient by account number
    const recipient = await prisma.user.findUnique({ where: { accountNumber: destination } });
    if (!recipient) return res.status(404).json({ error: 'Recipient account number not found' });

    const status = user.accountStatus === 'ACTIVE' ? 'APPROVED' : 'PENDING';

    // Deduct balance and create transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Deduct sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } }
      });

      const senderTx = await tx.transaction.create({
        data: {
          userId,
          type: 'TRANSFER_OUT',
          amount,
          currency,
          destination: recipient.fullName,
          recipientId: recipient.id,
          status
        }
      });

      if (status === 'APPROVED') {
        // Add to recipient
        await tx.wallet.upsert({
          where: { userId_currency: { userId: recipient.id, currency } },
          create: { userId: recipient.id, currency, balance: amount },
          update: { balance: { increment: amount } }
        });

        await tx.transaction.create({
          data: {
            userId: recipient.id,
            type: 'TRANSFER_IN',
            amount,
            currency,
            destination: user.fullName,
            status: 'APPROVED'
          }
        });
      }

      return senderTx;
    });

    // Notifications and Emails
    if (status === 'APPROVED') {
      // For Sender
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Transfer Sent',
          message: `You successfully sent $${amount.toFixed(2)} to ${recipient.fullName}.`
        }
      });
      await sendEmail(user.email, 'Transfer Sent', templates.transferSent(amount, recipient.fullName));

      // For Recipient
      await prisma.notification.create({
        data: {
          userId: recipient.id,
          title: 'Funds Received',
          message: `You received a transfer of $${amount.toFixed(2)} from ${user.fullName}.`
        }
      });
      await sendEmail(recipient.email, 'Funds Received', templates.transferReceived(amount, user.fullName));
    } else {
      // Notify sender it's pending
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Transfer Pending',
          message: `Your transfer of $${amount.toFixed(2)} to ${recipient.fullName} is pending admin approval.`
        }
      });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/withdraw', authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, destination, method, password, twoFactorCode, currency = 'USD' } = req.body;
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const wallet = await prisma.wallet.findUnique({ where: { userId_currency: { userId, currency } } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds in selected currency' });
    }

    // Security Verification
    if (user.isTwoFactorEnabled) {
      if (!twoFactorCode) return res.status(400).json({ error: '2FA code is required' });
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1
      });
      if (!isValid) return res.status(401).json({ error: 'Invalid 2FA code' });
    } else {
      if (!password) return res.status(400).json({ error: 'Password is required to confirm withdrawal' });
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
    }

    // Check KYC status logic
    if (user.kycStatus !== 'APPROVED') {
      // It still allows withdrawal request but it stays PENDING until KYC is approved or it fails.
      // Or we can outright reject it here. The spec says: "if their kyc is not approved the withdrawal should always be pending"
    }

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } }
      });

      return await tx.transaction.create({
        data: {
          userId,
          type: 'WITHDRAW',
          amount,
          currency,
          destination: `${method}:${destination}`,
          status: 'PENDING'
        }
      });
    });

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const MOCK_RATES: Record<string, number> = {
  'USD': 1.0,
  'EUR': 0.92,
  'GBP': 0.79,
  'NGN': 1500.0,
  'CAD': 1.36,
  'AUD': 1.52,
  'JPY': 151.0,
  'ZAR': 18.5,
  'BRL': 5.1,
  'INR': 83.5,
  'CNY': 7.24,
  'MXN': 16.7,
  'RUB': 92.5,
  'KRW': 1350.0,
  'TRY': 32.0,
};

router.post('/swap', authenticate, async (req: AuthRequest, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const userId = req.user!.id;

    if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid swap parameters' });
    }

    const fromWallet = await prisma.wallet.findUnique({ where: { userId_currency: { userId, currency: fromCurrency } } });
    if (!fromWallet || fromWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds for swap' });
    }

    const rate = (MOCK_RATES[toCurrency] || 1) / (MOCK_RATES[fromCurrency] || 1);
    const convertedAmount = amount * rate;

    const transaction = await prisma.$transaction(async (tx) => {
      // Deduct from
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { balance: { decrement: amount } }
      });

      // Add to
      await tx.wallet.upsert({
        where: { userId_currency: { userId, currency: toCurrency } },
        create: { userId, currency: toCurrency, balance: convertedAmount },
        update: { balance: { increment: convertedAmount } }
      });

      return await tx.transaction.create({
        data: {
          userId,
          type: 'SWAP',
          amount,
          currency: fromCurrency,
          destination: `Swapped to ${convertedAmount.toFixed(2)} ${toCurrency}`,
          status: 'APPROVED'
        }
      });
    });

    res.json({ transaction, rate, convertedAmount });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/contacts', authenticate, async (req: AuthRequest, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: req.user!.id,
        type: { in: ['TRANSFER', 'TRANSFER_OUT'] }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const names = [...new Set(transactions.map(tx => tx.destination).filter(Boolean))];
    
    const contacts = await Promise.all(names.map(async (name) => {
      const u = await prisma.user.findFirst({ where: { fullName: name } });
      if (u) {
        return {
          id: u.id,
          name: u.fullName,
          accountNumber: u.accountNumber,
          avatar: u.fullName.substring(0, 2).toUpperCase(),
          color: 'bg-indigo-500' // could randomize or generate based on string
        };
      }
      return null;
    }));
    
    res.json({ contacts: contacts.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
