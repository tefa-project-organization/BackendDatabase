import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function seedRoleLevels(prisma) {
  const data = [
    { id: 1, role_name: "Junior", role_level: 1, role_price: 100000 },
    { id: 2, role_name: "Intermediate", role_level: 2, role_price: 200000 },
    { id: 3, role_name: "Senior", role_level: 3, role_price: 300000 },
  ];

  for (const item of data) {
    await prisma.role_levels.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
}