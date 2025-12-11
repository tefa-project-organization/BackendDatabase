import { hash } from "../../src/helpers/bcrypt.helper.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedEmployees(prisma) {
  const password = await hash("Password123");

  const data = [
    {
      nik: "1234567890123456",
      nip: "123456789012345678",
      name: "Alice",
      email: "alice@example.com",
      phone: "081234567890",
      address: "Jakarta",
      position: "Manager",
      status: "active",
      password,
    },
    {
      nik: "1234567890123457",
      nip: "123456789012345679",
      name: "Bob",
      email: "bob@example.com",
      phone: "081234567891",
      address: "Bandung",
      position: "Auditor",
      status: "active",
      password,
    },
  ];

  for (const item of data) {
    await prisma.employees.upsert({
      where: { email: item.email },
      update: {},
      create: item,
    });
  }
}
