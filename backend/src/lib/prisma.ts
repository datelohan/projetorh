import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Helper to gracefully close the connection in tests or scripts
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
