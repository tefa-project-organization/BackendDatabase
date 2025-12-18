import BaseService from "../../base/service.base.js";
import prisma from "../../config/prisma.db.js";

class DashboardService extends BaseService {
  constructor() {
    super(prisma);
  }

  getSummary = async () => {
    const today = new Date();

    const [
      totalProjects,
      totalClients,
      totalTeams,
      totalPIC,
      totalEmployees,
      runningProjects
    ] = await Promise.all([
      // Total project (tidak dihapus)
      this.db.projects.count({
        where: { is_deleted: false }
      }),

      // Total client
      this.db.clients.count(),

      // Total team
      this.db.project_teams.count(),

      // Total PIC
      this.db.client_pics.count(),

      // Total employee (exclude resigned)
      this.db.employees.count({
        where: {
          status: { not: "resigned" }
        }
      }),

      // 🔥 PROJECT SEDANG BERJALAN
      this.db.projects.count({
        where: {
          is_deleted: false,
          started_at: {
            lte: today
          },
          OR: [
            { finished_at: null },
            { finished_at: { gte: today } }
          ]
        }
      })
    ]);

    return {
      total_projects: totalProjects,
      total_clients: totalClients,
      total_teams: totalTeams,
      total_pic: totalPIC,
      total_employees: totalEmployees,
      running_projects: runningProjects
    };
  };
}

export default DashboardService;
