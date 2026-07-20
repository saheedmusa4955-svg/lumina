import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (global.prisma) {
  prisma = global.prisma;
} else {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
  }
}

export default prisma;
