const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.setting.findMany().then(res => console.log(JSON.stringify(res, null, 2))).finally(() => prisma.$disconnect());
