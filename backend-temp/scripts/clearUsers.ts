import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup...');

  // Delete all dependent records first to avoid foreign key constraint failures
  console.log('Deleting all Devices...');
  await prisma.device.deleteMany();

  console.log('Deleting all Notifications...');
  await prisma.notification.deleteMany();

  console.log('Deleting all KycRequests...');
  await prisma.kycRequest.deleteMany();

  console.log('Deleting all Transactions...');
  await prisma.transaction.deleteMany();

  console.log('Deleting all Wallets...');
  await prisma.wallet.deleteMany();

  // Now safe to delete all users
  console.log('Deleting all Users...');
  await prisma.user.deleteMany();

  console.log('✅ All users and their related data have been successfully deleted.');
}

main()
  .catch((e) => {
    console.error('Error during cleanup:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
