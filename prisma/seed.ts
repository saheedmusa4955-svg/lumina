import prisma from '../api/db.ts';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding settings...');
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

  console.log('Checking if admin user exists...');
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@luminabank.com' }
  });

  if (!existingAdmin) {
    console.log('Creating admin user...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@luminabank.com',
        passwordHash: passwordHash,
        fullName: 'System Admin',
        accountNumber: '00000000',
        role: 'ADMIN',
        kycStatus: 'APPROVED',
        accountStatus: 'ACTIVE'
      }
    });
    console.log('✅ Admin user created successfully:');
    console.log('Email: admin@luminabank.com');
    console.log('Password: admin123');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
