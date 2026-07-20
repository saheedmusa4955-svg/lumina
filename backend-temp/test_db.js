const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS:", users);
  const txs = await prisma.transaction.findMany();
  console.log("TXS:", txs);
}
main().finally(() => prisma.$disconnect());
