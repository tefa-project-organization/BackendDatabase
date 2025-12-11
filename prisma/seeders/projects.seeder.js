import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedProjects(prisma) {
  const data = [
    {
      project_code: "PJ00001",
      project_name: "Project Audit A",
      project_type: "ET",
      client_id: 1,
      contract_value: 500000000
    },
    {
      project_code: "PJ00002",
      project_name: "Project Monitoring B",
      project_type: "FB",
      client_id: 2,
      contract_value: 300000000
    },
  ];

  for (const item of data) {
    await prisma.projects.upsert({
      where: { project_code: item.project_code },
      update: {},
      create: item,
    });
  }
}
