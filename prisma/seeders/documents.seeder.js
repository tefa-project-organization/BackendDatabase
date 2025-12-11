import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedDocuments(prisma) {
  const data = [
    {
      id: 1,
      number: "DOC-001",
      document_types: "BA",
      client_id: 1,
      client_pic_id: 1,
      project_id: 1,
      document_url: "https://example.com/doc1.pdf",
    },
    {
      id: 2,
      number: "DOC-002",
      document_types: "OP",
      client_id: 2,
      client_pic_id: 2,
      project_id: 2,
      document_url: "https://example.com/doc2.pdf",
    },
  ];

  for (const item of data) {
    await prisma.documents.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
}
