import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedProjectTeamMembers(prisma) {
  const data = [
    {
      id: 1,
      role_id: 1,
      project_teams_id: 1,
      employee_id: 1,
      job_description: "Junior staff"
    },
    {
      id: 2,
      role_id: 3,
      project_teams_id: 2,
      employee_id: 2,
      job_description: "Senior auditor"
    }
  ];

  for (const item of data) {
    await prisma.project_team_members.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
}
