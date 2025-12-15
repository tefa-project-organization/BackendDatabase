import BaseService from "../../base/service.base.js";
import prisma from "../../config/prisma.db.js";


class ProjectsService extends BaseService {
  constructor() {
    super(prisma);
  }

  // ================================================
  // HITUNG NILAI KONTRAK PROJECT DARI SEMUA TEAM + MEMBER
  // ================================================
  calculateContractValue = async (projectId) => {
    const teams = await this.db.project_teams.findMany({
      where: { project_id: projectId },
      include: {
        project_team_members: {
          include: { role_levels: true }
        }
      }
    });

    let total = 0;

    for (const team of teams) {
      for (const member of team.project_team_members) {
        const price = Number(member.role_levels?.role_price || 0);
        total += price;
      }
    }

    return total;
  };

  recalcAndUpdateContractValue = async (projectId) => {
    const newValue = await this.calculateContractValue(projectId);

    return await this.db.projects.update({
      where: { id: projectId },
      data: { contract_value: newValue }
    });
  };

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.projects.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.projects.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    return await this.db.projects.findUnique({ where: { id: Number(id) } });
  };

  create = async (payload) => {
    const project = await this.db.projects.create({
      data: {
        ...payload,
        contract_value: 0 // default
      }
    });

    // Hitung ulang
    return this.recalcAndUpdateContractValue(project.id);
  };

  update = async (id, payload) => {
  const projectId = Number(id);

  // 1. Pastikan project ada
  const project = await this.db.projects.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error("Projects not found");
  }

  // 2. Jika project_code dikirim, cek unique
  if (payload.project_code) {
    const codeExists = await this.db.projects.findFirst({
      where: {
        project_code: payload.project_code,
        NOT: { id: projectId }
      }
    });

    if (codeExists) {
      throw new Error("Project code already used");
    }
  }

  // 3. Jangan izinkan contract_value manual
  const { contract_value, ...safePayload } = payload;

  // 4. Update
  await this.db.projects.update({
    where: { id: projectId },
    data: safePayload
  });

  // 5. Recalculate contract value
  return await this.recalcAndUpdateContractValue(projectId);
};


  delete = async (id) => {
    return await this.db.projects.delete({ where: { id } });
  };
}

export default ProjectsService;
