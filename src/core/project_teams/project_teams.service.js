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

  findAll = async (query) => {
  const q = this.transformBrowseQuery(query);

  q.where = {
    ...q.where,
  };

  const data = await this.db.project_teams.findMany(q);

  if (query.paginate) {
    const countData = await this.db.project_teams.count({ where: q.where });
    return this.paginate(data, countData, q);
  }

  return data;
};

findById = async (id) => {
  const project_teams_Id = Number(id);

  return await this.db.project_teams.findFirst({
    where: {
      id: project_teams_Id,
    },
    include: {
          project_team_members: {
            include: {
              role_levels: true
            }
          }
        }
    });
  };

  create = async (payload) => {
    const team = await this.db.project_teams.create({ data: payload });

    if (payload.project_id) await this.recalc(payload.project_id);

    return team;
  };

  update = async (id, payload) => {

    const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => {
      if (value === undefined) return false;
      if (value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  );

    const project_teams_Id = Number(id);
    const updated = await this.db.project_teams.update({
      where: { id: project_teams_Id },
      data: filteredPayload
    });

    if (updated.project_teams_Id) await this.recalc(updated.project_id);

    return updated;
  };

  delete = async (id) => {
    const team = await this.db.project_teams.findUnique({ where: { id: Number(id) } });
      if (!team) {
        throw new Error("project_teams tidak ditemukan");
      } 
    const deleted = await this.db.project_teams.delete({ where: { id: Number(id) } });

    if (team?.project_id) await this.recalc(team.project_id);

    return deleted;
  };
}

export default ProjectTeamsService;
