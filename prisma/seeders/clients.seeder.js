import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export default async function seedClients(prisma) {
  const data = [
    { id: 1, name: "PT Maju Jaya", address: "Jakarta", phone: "021888777" },
    { id: 2, name: "CV Suka Makmur", address: "Bandung", phone: "022111222" },
  ];

  for (const item of data) {
    await prisma.clients.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
}
