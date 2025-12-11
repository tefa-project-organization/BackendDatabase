import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedClientPics(prisma) {
  const data = [
    {
      id: 1,
      name: "Budi",
      email: "budi@client.com",
      phone: "0811111111",
      title: "Finance",
      client_id: 1,
      project_id: 1,
    },
    {
      id: 2,
      name: "Sinta",
      email: "sinta@client.com",
      phone: "0822222222",
      title: "Manager",
      client_id: 2,
      project_id: 2,
    },
  ];

  for (const item of data) {
    await prisma.client_pics.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
}
