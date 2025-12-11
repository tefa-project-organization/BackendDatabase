import BaseService from "../../base/service.base.js";
import prisma from "../../config/prisma.db.js";
import ProjectsService from "../projects/projects.service.js";

class ProjectTeamMembersService extends BaseService {
  constructor() {
    super(prisma);
    this.projectsService = new ProjectsService(); // FIXED: buat instance
  }

  async recalc(teamId) {
    const team = await this.db.project_teams.findUnique({
      where: { id: teamId }
    });

    if (team?.project_id) {
      await this.projectsService.recalcAndUpdateContractValue(team.project_id);
    }
  }

  create = async (payload) => {
    const created = await this.db.project_team_members.create({ data: payload });
    await this.recalc(payload.project_teams_id);
    return created;
  };

  update = async (id, payload) => {
    const existing = await this.db.project_team_members.findUnique({ where: { id } });
    const updated = await this.db.project_team_members.update({
      where: { id },
      data: payload
    });
    await this.recalc(existing.project_teams_id);
    return updated;
  };

  delete = async (id) => {
    const existing = await this.db.project_team_members.findUnique({ where: { id } });
    const deleted = await this.db.project_team_members.delete({ where: { id } });

    await this.recalc(existing.project_teams_id);
    return deleted;
  };
}

export default ProjectTeamMembersService;
