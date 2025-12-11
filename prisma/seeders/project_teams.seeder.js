import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedProjectTeams(prisma) {
  const data = [
    {
      id: 1,
      project_teams_name: "Team A",
      project_teams_email: "teamA@example.com",
      manager_id: 1,
      auditor_id: 2,
      project_id: 1,
    },
    {
      id: 2,
      project_teams_name: "Team B",
      project_teams_email: "teamB@example.com",
      manager_id: 1,
      auditor_id: 2,
      project_id: 2,
    },
  ];

  for (const item of data) {
    await prisma.project_teams.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
}
