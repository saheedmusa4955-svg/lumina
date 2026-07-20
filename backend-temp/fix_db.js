const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.transaction.create({
    data: {
      userId: '52a2592a-8a4a-4ba1-9b01-6e0689beefeb', // recipient
      type: 'TRANSFER_IN',
      amount: 100,
      destination: 'Saheed Suleiman', // from sender
      status: 'APPROVED',
      createdAt: new Date('2026-06-30T16:56:34.528Z'),
      updatedAt: new Date('2026-06-30T16:56:34.528Z')
    }
  });
  console.log("Fixed missing transaction");
}
main().finally(() => prisma.$disconnect());
