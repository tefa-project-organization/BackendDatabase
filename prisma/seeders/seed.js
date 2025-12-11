import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import seedRoleLevels from "./role_levels.seeder.js";
import seedEmployees from "./employees.seeder.js";
import seedClients from "./clients.seeder.js";
import seedProjects from "./projects.seeder.js";
import seedClientPics from "./client_pics.seeder.js";
import seedProjectTeams from "./project_teams.seeder.js";
import seedProjectTeamMembers from "./project_team_members.seeder.js";
import seedDocuments from "./documents.seeder.js";

async function main() {
  console.log("Seeding role levels...");
  await seedRoleLevels(prisma);

  console.log("Seeding employees...");
  await seedEmployees(prisma);

  console.log("Seeding clients...");
  await seedClients(prisma);

  console.log("Seeding projects...");
  await seedProjects(prisma);

  console.log("Seeding client pics...");
  await seedClientPics(prisma);

  console.log("Seeding project teams...");
  await seedProjectTeams(prisma);

  console.log("Seeding team members...");
  await seedProjectTeamMembers(prisma);

  console.log("Seeding documents...");
  await seedDocuments(prisma);

  console.log("Done.");
}

main()
  .catch((err) => console.error(err))
  .finally(async () => prisma.$disconnect());
