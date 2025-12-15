import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import ProjectsService from "../projects/projects.service.js";

class ProjectTeamsService extends BaseService {
  constructor() {
    super(prisma);
    this.projectsService = new ProjectsService(); // FIXED
  }

  async recalc(project_id) {
    await this.projectsService.recalcAndUpdateContractValue(project_id);
  }

  create = async (payload) => {
    const team = await this.db.project_teams.create({ data: payload });

    if (payload.project_id) await this.recalc(payload.project_id);

    return team;
  };

  update = async (id, payload) => {
    const updated = await this.db.project_teams.update({
      where: { id },
      data: payload
    });

    if (updated.project_id) await this.recalc(updated.project_id);

    return updated;
  };

  delete = async (id) => {
    const team = await this.db.project_teams.findUnique({ where: { id } });
    const deleted = await this.db.project_teams.delete({ where: { id } });

    if (team?.project_id) await this.recalc(team.project_id);

    return deleted;
  };
}

export default ProjectTeamsService;
