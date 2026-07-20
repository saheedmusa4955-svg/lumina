import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@luminabank.com',
      passwordHash: passwordHash,
      fullName: 'System Admin',
      accountNumber: '00000000',
      role: 'ADMIN',
      kycStatus: 'APPROVED'
    }
  });

  console.log('✅ Admin user created successfully:');
  console.log(`Email: admin@luminabank.com`);
  console.log(`Password: admin123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
