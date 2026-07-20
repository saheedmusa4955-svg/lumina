import { Router } from 'express';
import prisma from '../db';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendTransactionEmail } from '../email';

const router = Router();

router.use(authenticate, requireAdmin);

// Get overview stats
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const pendingTransactions = await prisma.transaction.count({ where: { status: 'PENDING' } });
    
    const balances = await prisma.wallet.groupBy({
      by: ['currency'],
      _sum: { balance: true }
    });
    const systemBalances = balances.map(b => ({ currency: b.currency, balance: b._sum.balance || 0 }));

    res.json({
      totalUsers,
      pendingTransactions,
      balances: systemBalances
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Credit User Wallet
router.post('/credit-wallet', async (req, res) => {
  try {
    const { identifier, amount, currency = 'USD' } = req.body;
    
    if (!identifier || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { accountNumber: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      await tx.wallet.upsert({
        where: { userId_currency: { userId: user.id, currency } },
        create: { userId: user.id, currency, balance: amount },
        update: { balance: { increment: amount } }
      });

      return tx.transaction.create({
        data: {
          userId: user.id,
          type: 'DEPOSIT',
          amount,
          currency,
          destination: 'Admin Credit',
          status: 'APPROVED'
        }
      });
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Wallet Credited',
        message: `Your wallet has been credited with $${amount.toFixed(2)} by an admin.`
      }
    });
    
    // Attempt to send email but don't fail if it doesn't exist for DEPOSIT
    try {
      await sendTransactionEmail(user.email, 'DEPOSIT', amount, 'APPROVED');
    } catch (e) {
      // Ignored
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, fullName: true, email: true, accountStatus: true, kycStatus: true, role: true, wallets: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user account status
router.post('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE' or 'INACTIVE'

    const user = await prisma.user.update({
      where: { id },
      data: { accountStatus: status }
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all pending transactions
router.get('/transactions/pending', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, fullName: true, kycStatus: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve Transaction
router.post('/transactions/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await prisma.transaction.findUnique({ where: { id }, include: { user: true } });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    
    // Only allow approval if KYC is approved
    if (transaction.user.kycStatus !== 'APPROVED' && transaction.type === 'WITHDRAW') {
      return res.status(400).json({ error: 'Cannot approve withdrawal. User KYC is not approved.' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    if (transaction.type === 'TRANSFER_OUT' && transaction.recipientId) {
      await prisma.$transaction(async (tx) => {
        // Increment recipient balance
        await tx.wallet.upsert({
          where: { userId_currency: { userId: transaction.recipientId!, currency: transaction.currency } },
          create: { userId: transaction.recipientId!, currency: transaction.currency, balance: transaction.amount },
          update: { balance: { increment: transaction.amount } }
        });

        // Create TRANSFER_IN for recipient
        await tx.transaction.create({
          data: {
            userId: transaction.recipientId!,
            type: 'TRANSFER_IN',
            amount: transaction.amount,
            currency: transaction.currency,
            destination: transaction.user.fullName,
            status: 'APPROVED'
          }
        });
      });
      
      const recipient = await prisma.user.findUnique({ where: { id: transaction.recipientId } });
      if (recipient) {
        // For Recipient
        await prisma.notification.create({
          data: {
            userId: recipient.id,
            title: 'Funds Received',
            message: `You received a transfer of $${transaction.amount.toFixed(2)} from ${transaction.user.fullName}.`
          }
        });
      }
    }

    await sendTransactionEmail(transaction.user.email, transaction.type, transaction.amount, 'APPROVED');

    res.json({ transaction: updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Decline Transaction
router.post('/transactions/:id/decline', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) return res.status(400).json({ error: 'Decline reason is required' });

    const transaction = await prisma.transaction.findUnique({ where: { id }, include: { user: true } });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    // Refund the balance if it was a withdrawal or transfer that failed
    await prisma.$transaction(async (tx) => {
      await tx.wallet.upsert({
        where: { userId_currency: { userId: transaction.userId, currency: transaction.currency } },
        create: { userId: transaction.userId, currency: transaction.currency, balance: transaction.amount },
        update: { balance: { increment: transaction.amount } }
      });

      await tx.transaction.update({
        where: { id },
        data: { status: 'DECLINED', adminReason: reason }
      });
    });

    await sendTransactionEmail(transaction.user.email, transaction.type, transaction.amount, 'DECLINED', reason);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all pending KYC
router.get('/kyc/pending', async (req, res) => {
  try {
    const requests = await prisma.kycRequest.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, fullName: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject KYC
router.post('/kyc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    const kyc = await prisma.kycRequest.findUnique({ where: { id } });
    if (!kyc) return res.status(404).json({ error: 'KYC not found' });

    await prisma.$transaction([
      prisma.kycRequest.update({
        where: { id },
        data: { status }
      }),
      prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: status }
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Global Settings ---
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const config: Record<string, string> = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const config = req.body;
    // Iterate and upsert all settings
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string') {
        await prisma.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value }
        });
      }
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
