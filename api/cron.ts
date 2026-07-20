import { Router } from 'express';
import prisma from './db';
import { sendTransactionEmail } from './email';

const router = Router();

router.get('/', async (req, res) => {
  // Verify Vercel Cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[CRON] Running 24-hour transaction timeout check...');
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: twentyFourHoursAgo
        }
      },
      include: { user: true }
    });

    let processedCount = 0;

    for (const tx of expiredTransactions) {
      await prisma.$transaction(async (prismaTx) => {
        // Refund if necessary (Deposits don't hold balance so no refund needed)
        if (tx.type !== 'DEPOSIT') {
          await prismaTx.wallet.upsert({
            where: {
              userId_currency: {
                userId: tx.userId,
                currency: tx.currency
              }
            },
            create: {
              userId: tx.userId,
              currency: tx.currency,
              balance: tx.amount
            },
            update: {
              balance: { increment: tx.amount }
            }
          });
        }

        await prismaTx.transaction.update({
          where: { id: tx.id },
          data: {
            status: 'FAILED',
            adminReason: 'System Timeout: Admin did not process the transaction within 24 hours.'
          }
        });
      });

      await sendTransactionEmail(
        tx.user.email,
        tx.type,
        tx.amount,
        'FAILED',
        'System Timeout: Transaction was not processed within 24 hours.'
      );

      console.log(`[CRON] Transaction ${tx.id} marked as FAILED due to timeout.`);
      processedCount++;
    }

    res.json({ status: 'ok', processedCount });
  } catch (error) {
    console.error('[CRON] Error running timeout job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
