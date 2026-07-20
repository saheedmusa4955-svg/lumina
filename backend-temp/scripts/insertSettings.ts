import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { key: 'EMAIL_PROVIDER' },
    create: { key: 'EMAIL_PROVIDER', value: 'BREVO' },
    update: { value: 'BREVO' }
  });
  
  await prisma.setting.upsert({
    where: { key: 'BREVO_API_KEY' },
    create: { key: 'BREVO_API_KEY', value: process.env.BREVO_API_KEY || 'xkeysib-placeholder' },
    update: { value: process.env.BREVO_API_KEY || 'xkeysib-placeholder' }
  });

  await prisma.setting.upsert({
    where: { key: 'SMTP_FROM' },
    create: { key: 'SMTP_FROM', value: '"Lumina Bank" <team@theluminaonlinebanking.com>' },
    update: { value: '"Lumina Bank" <team@theluminaonlinebanking.com>' }
  });

  console.log('Settings successfully inserted into DB!');
}

main().finally(() => prisma.$disconnect());
